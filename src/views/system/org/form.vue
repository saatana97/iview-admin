<template>
	<k-window
		:title="text[type]+'组织机构'"
		visible
		width="30%"
		:close-on-click-modal="false"
		:close-on-press-escape="false"
		@close="handleClose"
	>
		<el-form :rules="rule" ref="form" label-width="150px" :model="form" v-loading="loading">
			<el-form-item label="上级组织机构" prop="parentName">
				<el-input v-model="form.parentName" readonly placeholder="不选表示这是一个顶级组织机构">
					<tree-dialog
						slot="append"
						:data.sync="tree"
						:props="{label:'title'}"
						:show-checkbox="false"
						:handleFilterTree="handleFilterTree"
						@ok="handleCheckParent"
						@clear="handleCheckParent(false)"
					></tree-dialog>
				</el-input>
			</el-form-item>
			<el-form-item label="组织机构名称" prop="title">
				<el-input v-model="form.title" clearable></el-input>
			</el-form-item>
			<el-form-item label="组织机构代码" prop="code">
				<el-input v-model="form.code" clearable></el-input>
			</el-form-item>
			<el-form-item label="类型" prop="type">
				<el-select v-model="form.type" clearable>
					<el-option v-for="(item,index) in opts.type" :key="index" :label="item" :value="index"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="级别" prop="level">
				<el-select v-model="form.level" clearable>
					<el-option v-for="(item,index) in opts.level" :key="index" :label="item" :value="index"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="备注" prop="description">
				<el-input type="textarea" v-model="form.description" clearable></el-input>
			</el-form-item>
		</el-form>
		<div slot="footer" class="dialog-footer">
			<el-button @click="handleClose">取 消</el-button>
			<el-button type="primary" :loading="loading" @click="handleSave">保 存</el-button>
		</div>
	</k-window>
</template>
<script>
import API from "@/api/org";
import TreeDialog from "@/components/TreeDialog";
import ObjectUtils from "@/utils/ObjectUtils";

export default {
	name: "MenuForm",
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
				parentId: null,
				title: null,
				code: null,
				type: 0,
				level: 0,
				description: null,
				parentName: ""
			},
			old: {},
			opts: {
				type: ["国家/地区", "组织机构"],
				level: [
					"大洲",
					"国家",
					"省",
					"市",
					"县区",
					"镇街",
					"村居",
					"组织机构"
				]
			},
			rule: {
				title: [
					{ required: true, message: "组织机构名称不能为空" },
					{
						async validator(rule, value, cb) {
							if (value === _this.old.title) {
								cb();
							} else {
								let res = await API.Check({
									title: value
								});
								if (res.length === 0) {
									cb();
								} else {
									cb("组织机构名称不能重复");
								}
							}
						}
					}
				],
				code: [
					{ required: true, message: "组织机构代码不能为空" },
					{
						async validator(rule, value, cb) {
							if (value === _this.old.code) {
								cb();
							} else {
								let res = await API.Check({
									code: value
								});
								if (res.length === 0) {
									cb();
								} else {
									cb("组织机构代码不能重复");
								}
							}
						}
					}
				],
				type: [{ required: true, message: "请选择组织机构类型" }],
				level: [{ required: true, message: "请选择组织机构级别" }]
			},
			tree: [],
			list: []
		};
	},
	watch: {
		"form.parentName"(value) {
			if (!value) {
				this.form.parentId = 0;
			}
		}
	},
	methods: {
		// 表单关闭
		handleClose() {
			this.$refs.form.resetFields();
			this.$router.push({ name: "OrgManager" });
		},
		async handleLoadTree() {
			this.list = await API.List();
			this.tree = await API.Tree();
		},
		//提交表单
		async handleSave() {
			try {
				await this.$refs.form.validate();
				this.loading = true;
				let Save = this.type === "create" ? API.Create : API.Update;
				let res = await Save(this.form);
				if (res) {
					this.$message({
						showClose: true,
						message: "保存成功",
						type: "success"
					});
					this.handleClose();
				}
				this.loading = false;
			} catch (e) {
				console.info(e);
			}
		},
		handleFilterTree(value, data, node) {
			return data.id !== this.form.id && data.parentId !== this.form.id;
		},
		handleCheckParent(node) {
			if (node) {
				this.form.parentName = node.name;
				this.form.parentId = node.id;
				this.form.level = node.level + 1;
			} else {
				this.form.parentName = null;
				this.form.parentId = null;
			}
		}
	},
	async mounted() {
		this.loading = true;
		await this.handleLoadTree();
		let id = this.$route.query.id;
		if (id) {
			this.type = "update";
			let res = await API.Get(id);
			if (res) {
				ObjectUtils.Copy(res, this.form, true);
			} else {
				this.$message.error("无效的ID");
				this.handleClose();
			}
		}
		let parentId = this.$route.query.parentId;
		if (parentId) {
			this.form.parentId = parentId;
		}
		if (this.form.parentId) {
			let parent = this.list.find(item => {
				return item.id === this.form.parentId;
			});
			if (parent) {
				this.form.parentName = parent.title;
				this.form.level = parent.level + 1;
			}
		}
		this.old = { ...this.form };
		this.loading = false;
	}
};
</script>
