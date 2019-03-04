<template>
	<Modal
		v-model="visiable"
		:mask-closable="false"
		:closable="false"
		scrollable
		@on-visible-change="handleVisiableChange"
	>
		<template slot="header" v-if="type === 'create'">
			<Icon type="md-add-circle"/>
			<span>添加用户</span>
		</template>
		<template slot="header" v-else>
			<Icon type="ios-create"/>
			<span>编辑用户</span>
		</template>
		<Form :model="form" :rules="rules" :label-width="80" ref="form">
			<FormItem label="姓名" prop="name">
				<Input v-model="form.name" clearable placeholder="Enter something..."></Input>
			</FormItem>
			<FormItem label="用户名" prop="authorizer.username">
				<Input v-model="form.authorizer.username" clearable placeholder="请输入用户名"></Input>
			</FormItem>
			<FormItem label="登录密码" prop="authorizer.password">
				<Input v-model="form.authorizer.password" clearable placeholder="请输入登录密码" type="password"></Input>
			</FormItem>
			<FormItem label="确认密码" prop="repwd">
				<Input v-model="form.repwd" clearable placeholder="请再次确认登录密码" type="password"></Input>
			</FormItem>
			<FormItem label="出生日期" prop="birthday">
				<DatePicker
					v-model="form.birthday"
					type="date"
					placeholder="请选择出生日期"
					clearable
					style="width: 200px"
				></DatePicker>
			</FormItem>
			<FormItem label="地址" prop="address">
				<Input v-model="form.address" clearable placeholder="请输入地址"></Input>
			</FormItem>
			<FormItem label="备注" prop="description">
				<Input
					v-model="form.description"
					type="textarea"
					:autosize="{minRows: 2,maxRows: 5}"
					:maxlength="255"
					placeholder="请输入备注信息"
				></Input>
			</FormItem>
		</Form>
		<template slot="footer">
			<Button type="primary" ghost size="large" @click="handleCancel">取消</Button>
			<Button type="primary" size="large" :loading="loading" @click="handleSave">保存</Button>
		</template>
	</Modal>
</template>
<script>
import UserApi from "@/api/user";
import AuthApi from "@/api/auth";
export default {
	data() {
		const _this = this;
		return {
			visiable: false,
			loading: false,
			modify: 0,
			form: { authorizer: {} },
			type: "create",
			oldUsername: "",
			rules: {
				"authorizer.username": [
					{
						required: true,
						message: "用户名不能为空",
						trigger: "change"
					},
					{
						async validator(rule, value, cb) {
							if (_this.oldUsername === value) {
								cb();
							} else {
								let res = await AuthApi.Check({
									username: value
								});
								if (res.length === 0) {
									cb();
								} else {
									cb(new Error("用户名已存在"));
								}
							}
						},
						trigger: "blur"
					}
				],
				"authorizer.password": [
					{
						validator(rule, value, cb) {
							if (
								value &&
								(value.length < 6 || value.length > 20)
							) {
								cb(new Error("密码长度在6-20位之间"));
							} else {
								cb();
							}
						},
						trigger: "change"
					}
				],
				repwd: [
					{
						validator(rule, value, cb) {
							if (value !== _this.form.authorizer.password) {
								cb(new Error("两次密码输入不一致"));
							} else {
								cb();
							}
						},
						trigger: "change"
					}
				],
				name: [
					{
						required: true,
						message: "姓名不能为空",
						trigger: "change"
					}
				]
			}
		};
	},

	methods: {
		show(row, type) {
			this.form = row
				? JSON.parse(JSON.stringify(row))
				: { authorizer: {} };
			this.oldUsername = this.form.authorizer.username;
			this.type = type || "create";
			this.visiable = true;
		},
		handleSave() {
			const _this = this;
			this.$refs.form.validate(async res => {
				this.loading = true;
				if (res) {
					let Save = _this.form.id ? UserApi.Update : UserApi.Create;
					await Save(_this.form);
					this.$emit("save", _this.form);
					_this.visiable = false;
				} else {
					setTimeout(() => {
						_this.loading = false;
					}, 1000);
				}
			});
		},
		handleVisiableChange(visiable) {
			if (visiable) {
				this.modify = -1;
			} else {
				this.loading = false;
				this.$refs.form.resetFields();
			}
		},
		handleCancel() {
			if (this.modify === 0) {
				this.visiable = false;
			} else {
				this.$Modal.confirm({
					title: "操作提示",
					content: "当前数据未保存，确定要关闭本窗口吗？",
					closable: true,
					onOk: () => {
						this.visiable = false;
					}
				});
			}
		}
	},
	watch: {
		form: {
			deep: true,
			handler: function() {
				this.modify++;
			}
		}
	}
};
</script>
