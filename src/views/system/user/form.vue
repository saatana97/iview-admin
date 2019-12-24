<template>
	<k-window
		:title="text[type]+'用户'"
		visible
		width="35%"
		:close-on-click-modal="false"
		:close-on-press-escape="false"
		@close="handleClose"
	>
		<el-form :rules="rule" ref="form" label-width="100px" :model="form" v-loading="loading">
			<el-form-item label="所属部门" prop="org.id">
				<el-input v-model="form.org.title" readonly>
					<tree-dialog
						slot="append"
						:data.sync="deptTree"
						:props="{label:'title'}"
						:show-checkbox="false"
						:handle-search="(node,text)=>node.name.indexOf(text)!==-1"
						@ok="handleCheckParent"
						@clear="handleCheckParent(false)"
					></tree-dialog>
				</el-input>
			</el-form-item>
			<el-form-item label="用户名" prop="authorizer.username">
				<el-input
					v-model="form.authorizer.username"
					:clearable="type==='create'"
					:readonly="type!=='create'"
				></el-input>
			</el-form-item>
			<el-form-item label="密码" prop="authorizer.password">
				<el-input
					v-model="form.authorizer.password"
					clearable
					show-password
					placeholder="添加用户必须填写密码，编辑时如无需修改密码则留空"
				></el-input>
			</el-form-item>
			<el-form-item label="确认密码" prop="repwd">
				<el-input placeholder="请再次确认密码" v-model="form.repwd" show-password></el-input>
			</el-form-item>
			<el-form-item label="性别" prop="sex">
				<el-radio
					v-for="(item,index) in opts.sex"
					:key="index"
					:label="index"
					v-model="form.sex"
				>{{item}}</el-radio>
			</el-form-item>
			<el-form-item label="出生日期" prop="birthday">
				<el-date-picker type="date" format="yyyy年MM月dd日" v-model="form.birthday"></el-date-picker>
			</el-form-item>
			<el-form-item label="真实姓名" prop="ame">
				<el-input v-model="form.name" clearable></el-input>
			</el-form-item>
			<el-form-item label="手机号码" prop="mobilePhone">
				<el-input v-model="form.mobilePhone" maxlength="11" clearable></el-input>
			</el-form-item>
			<el-form-item label="电话号码" prop="telPhone">
				<el-input v-model="form.telPhone" maxlength="15" clearable></el-input>
			</el-form-item>
			<el-form-item label="邮箱地址" prop="email">
				<el-input v-model="form.email" clearable></el-input>
			</el-form-item>
			<el-form-item label="角色分配" prop="authorizer.roles">
				<el-transfer
					style="overflow:auto;"
					v-model="form.authorizer.roles"
					:data="roleList"
					:titles="['未分配','已分配']"
				></el-transfer>
			</el-form-item>
		</el-form>
		<div slot="footer" class="dialog-footer">
			<el-button @click="handleClose">取 消</el-button>
			<el-button type="primary" :loading="loading" @click="handleSave">保 存</el-button>
		</div>
	</k-window>
</template>
<script>
import UserAPI from "@/api/user";
import OrgAPI from "@/api/org";
import RoleAPI from "@/api/role";
import DictAPI from "@/api/dict";
import TreeDialog from "@/components/TreeDialog";
import ObjectUtils from "@/utils/ObjectUtils";
export default {
	name: "UserForm",
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
				org: {
					id: null,
					title: null
				},
				authorizer: {
					username: null,
					password: null,
					roles: []
				},
				repwd: null,
				birthday: null,
				email: null,
				mobilePhone: null,
				telPhone: null,
				photo: null,
				name: null,
				sex: 1
			},
			old: {},
			opts: {
				sex: []
			},
			rule: {
				orgName: [{ required: true, message: "所属部门不能为空" }],
				"authorizer.username": [
					{ required: true, message: "用户名不能为空" },
					{
						async validator(rule, value, cb) {
							if (value === _this.old.authorizer.username) {
								cb();
							} else {
								let res = await UserAPI.Check({
									authorizer: { username: value }
								});
								if (res.length === 0) {
									cb();
								} else {
									cb("用户名已存在");
								}
							}
						}
					}
				],
				"authorizer.password": [
					{
						validator(rule, value, cb) {
							if (
								(_this.form.id && !value) ||
								/^[0-9A-Za-z-_\.]{6,20}$/.test(value)
							) {
								cb();
							} else if (!_this.form.id && !value) {
								cb("密码不能为空");
							} else {
								cb(
									"密码由6~20位字母、数字、下划线、分割线和小数点组成"
								);
							}
						}
					}
				],
				repwd: [
					{
						validator(rule, value, cb) {
							if (_this.form.authorizer.password === value) {
								cb();
							} else {
								cb(new Error("两次输入的密码不一致"));
							}
						}
					}
				],
				sex: [{ required: true, message: "性别不能为空" }],
				birthday: [{ required: true, message: "出生日期不能为空" }],
				name: [{ required: true, message: "真实姓名不能为空" }],
				"authorizer.roles": [
					{ required: true, message: "角色不能为空" }
				],
				mobilePhone: [
					{ required: true, message: "手机号码不能为空" },
					{
						validator(rule, value, cb) {
							if (/^[1]\d{10}$/.test(value)) {
								cb();
							} else {
								cb("手机号码格式错误");
							}
						}
					}
				]
			},
			deptTree: [],
			roleList: []
		};
	},
	methods: {
		// 表单关闭
		handleClose() {
			this.$refs.form.resetFields();
			this.$router.push({ name: "UserManager" });
		},
		async handleLoadDict() {
			let res = await DictAPI.Check({ type: "性别" });
			this.opts.sex = [];
			res.forEach(item => {
				this.opts.sex[item.value] = item.label;
			});
		},
		async handleLoadRole() {
			this.roleList =
				JSON.parse(this.$store.session("user") || "{}").roles || [];
			this.roleList = this.roleList.map(item => {
				return { key: item.id, label: item.name };
			});
		},
		async handleLoadDept() {
			this.deptTree = await OrgAPI.Tree();
		},
		//提交表单
		async handleSave() {
			try {
				await this.$refs.form.validate();
				this.loading = true;
				let Save =
					this.type === "create" ? UserAPI.Create : UserAPI.Update;
				let data = {
					...this.form,
					authorizer: {
						...this.form.authorizer,
						roles: [...this.form.authorizer.roles]
					}
				};
				data.authorizer.roles = data.authorizer.roles.map(item => {
					return { id: item };
				});
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
		},
		handleFilterTree(value, data, node) {
			return data.id !== this.form.id;
		},
		handleCheckParent(node) {
			if (node) {
				this.form.org.title = node.title;
				this.form.org.id = node.code;
			} else {
				this.form.org.title = null;
				this.form.org.id = null;
			}
		}
	},
	async mounted() {
		this.loading = true;
		await this.handleLoadDict();
		await this.handleLoadRole();
		await this.handleLoadDept();
		let id = this.$route.query.id;
		if (id) {
			this.type = "update";
			let res = await UserAPI.Get(id);
			if (res) {
				ObjectUtils.Copy(res, this.form, true);
				this.form.authorizer.roles = this.form.authorizer.roles.map(
					item => item.id
				);
				this.form.authorizer.password = null;
			} else {
				this.$message.error("加载用户失败");
				this.handleClose();
			}
		}
		this.old = { ...this.form };
		this.loading = false;
	}
};
</script>
