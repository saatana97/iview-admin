<template>
	<k-window
		:title="text[type]+'角色'"
		visible
		width="30%"
		:close-on-click-modal="false"
		:close-on-press-escape="false"
		@close="handleClose"
	>
		<el-form :rules="rule" ref="form" label-width="100px" :model="form" v-loading="loading">
			<el-form-item label="角色名称" prop="name">
				<el-input v-model="form.name" clearable></el-input>
			</el-form-item>
			<el-form-item label="角色代码" prop="code">
				<el-input v-model="form.code" clearable></el-input>
			</el-form-item>
			<el-form-item label="备注" prop="description">
				<el-input type="textarea" v-model="form.description" clearable></el-input>
			</el-form-item>
			<el-form-item label="功能权限" prop="menus">
				<el-tree
					style="height:200px;overflow:auto;"
					ref="menuTree"
					:data="menuTree"
					:props="{label:'title'}"
					show-checkbox
					default-expand-all
					node-key="code"
					:default-checked-keys="form.menus"
					@check-change="handleMenuCheckChange"
				></el-tree>
			</el-form-item>
		</el-form>
		<div slot="footer" class="dialog-footer">
			<el-button @click="handleClose">取 消</el-button>
			<el-button type="primary" :loading="loading" @click="handleSave">保 存</el-button>
		</div>
	</k-window>
</template>
<script>
import RoleAPI from "@/api/role";
import MenuAPI from "@/api/menu";
import TreeDialog from "@/components/TreeDialog";
import TreeUtils from "@/utils/TreeUtils";
import ObjectUtils from "@/utils/ObjectUtils";

export default {
	name: "RoleForm",
	components: {
		TreeDialog
	},
	data() {
		const _this = this;
		return {
			loading: false,
			type: "create", //表单模式
			text: { create: "添加", update: "编辑" }, //表单模式对应文本
			form: {
				id: null,
				name: null,
				code: null,
				remark: null,
				menus: []
			},
			old: {},
			rule: {
				name: [
					{ required: true, message: "角色名称不能为空" },
					{
						async validator(rule, value, cb) {
							if (value === _this.old.name) {
								cb();
							} else {
								let res = await RoleAPI.Check({
									name: value
								});
								if (res.length === 0) {
									cb();
								} else {
									cb("角色名称不能重复");
								}
							}
						}
					}
				],
				code: [
					{ required: true, message: "角色代码不能为空" },
					{
						async validator(rule, value, cb) {
							if (value === _this.old.code) {
								cb();
							} else {
								let res = await RoleAPI.Check({
									code: value
								});
								if (res.length === 0) {
									cb();
								} else {
									cb("角色代码不能重复");
								}
							}
						}
					}
				],
				menus: [{ required: true, message: "功能权限不能为空" }]
			},
			menuTree: [],
			menuMap: [],
			menuPid: []
		};
	},
	methods: {
		// 表单关闭
		handleClose() {
			this.$refs.form.resetFields();
			this.$router.push({ name: "RoleManager" });
		},
		async handleLoadMenu() {
			const _this = this;
			this.menuTree = await MenuAPI.Tree();
			this.menuMap = new Map();
			(function scale(arr) {
				if (arr instanceof Array) {
					arr.forEach(item => {
						_this.menuMap.set(item.code, item.data);
						if (item.children.length > 0) {
							_this.menuPid.push(item.code);
							scale(item.children);
						}
					});
				}
			})(this.menuTree);
			this.menuTree = [
				{
					title: "全部",
					code: "all",
					children: this.menuTree
				}
			];
		},
		handleMenuCheckChange(node, checked, arr) {
			this.form.menus = this.$refs.menuTree.getCheckedKeys();
		},
		//提交表单
		async handleSave() {
			try {
				await this.$refs.form.validate();
				const _this = this;
				this.loading = true;
				let Save =
					this.type === "create" ? RoleAPI.Create : RoleAPI.Update;
				let data = { ...this.form };
				let half = this.$refs.menuTree.getHalfCheckedKeys();
				data.menus.push.apply(data.menus, half);
				data.menus = data.menus
					.map(item => {
						return _this.menuMap.get(item);
					})
					.filter(item => item);
				let res = await Save(data);
				if (res) {
					this.$message({
						showClose: true,
						message: "保存成功",
						type: "success"
					});
					this.handleClose();
				} else {
					this.$message.error("保存失败");
				}
				this.loading = false;
			} catch (e) {
				console.info(e);
			}
		}
	},
	async mounted() {
		this.loading = true;
		await this.handleLoadMenu();
		let id = this.$route.query.id;
		if (id) {
			this.type = "update";
			let res = await RoleAPI.Get(id);
			if (res) {
				ObjectUtils.Copy(res, this.form, true);
				this.form.menus = res.menus
					.filter(item => this.menuPid.indexOf(item.id) === -1)
					.map(item => item.id);
			} else {
				this.$message.error("无效的ID");
				this.handleClose();
			}
		}
		this.old = { ...this.form };
		this.loading = false;
	}
};
</script>
