<template>
	<Modal
		v-model="visiable"
		:mask-closable="false"
		:closable="false"
		scrollable
		:width="540"
		@on-visible-change="handleVisiableChange"
	>
		<template slot="header" v-if="type === 'create'">
			<Icon type="md-add-circle"/>
			<span>添加角色</span>
		</template>
		<template slot="header" v-else>
			<Icon type="ios-create"/>
			<span>编辑角色</span>
		</template>
		<Form :model="form" :rules="rules" :label-width="80" ref="form">
			<FormItem label="名称" prop="name">
				<Input v-model="form.name" clearable placeholder="请输入角色名称"></Input>
			</FormItem>
			<FormItem label="代码" prop="code">
				<Input v-model="form.code" clearable placeholder="请输入角色代码"></Input>
			</FormItem>
			<FormItem label="功能权限" prop="menus" required>
				<div style="max-height:30vh;overflow:auto;border: 1px solid #dcdee2;border-radius: 4px;">
					<Tree
						:data="menus"
						show-checkbox
						ref="menuTree"
						@on-check-change="handleMenuTreeCheckedChange"
					></Tree>
				</div>
			</FormItem>
			<FormItem label="数据权限" prop="accessScopes">
				<div style="max-height:30vh;overflow:auto;border: 1px solid #dcdee2;border-radius: 4px;">
					<Tree
						:data="orgs"
						show-checkbox
						ref="orgsTree"
						@on-check-change="handleOrgTreeCheckedChange"
						check-strictly
					></Tree>
				</div>
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
import TreeSelection from "@/components/TreeSelection";
import MenuAPI from "@/api/menu";
import OrgAPI from "@/api/org";
import RoleAPI from "@/api/role";
export default {
	components: {
		TreeSelection
	},
	data() {
		return {
			visiable: false,
			loading: false,
			modify: 0,
			type: "create",
			form: { menus: [], menusName: "" },
			menus: [],
			orgs: [],
			rules: {
				name: [
					{
						required: true,
						message: "角色名称不能为空",
						trigger: "change"
					}
				],
				code: [
					{
						required: true,
						message: "角色代码不能为空",
						trigger: "change"
					}
				],
				menus: [
					{
						validator(rule, value, cb) {
							if (value instanceof Array && value.length > 0) {
								cb();
							} else {
								cb(new Error());
							}
						},
						message: "功能权限不能为空",
						trigger: "change"
					}
				]
			}
		};
	},
	methods: {
		async show(row, type) {
			this.form = row
				? JSON.parse(JSON.stringify(row))
				: { menus: [], menusName: "" };
			this.type = type || "create";
			if (this.form.id) {
				this.menus = await MenuAPI.TreeByRole(this.form.id);
				this.orgs = await OrgAPI.TreeByRole(this.form.id);
			} else {
				this.menus = await MenuAPI.Tree();
				this.orgs = await OrgAPI.Tree();
			}
			this.visiable = true;
		},
		handleSave() {
			const _this = this;
			this.$refs.form.validate(async res => {
				this.loading = true;
				if (res) {
					let data = { ...this.form };
					let Save = data.id ? RoleAPI.Update : RoleAPI.Create;
					await Save(data);
					this.$emit("save", data);
					this.visiable = false;
				} else {
					setTimeout(() => {
						_this.loading = false;
					}, 1000);
				}
			});
		},
		handleMenuTreeCheckedChange(checked, node) {
			this.form.menus = checked.map(item => {
				return { id: item.data.id };
			});
		},
		handleOrgTreeCheckedChange(checked, node) {
			this.form.accessScopes = checked.map(item => {
				return item.data.id;
			});
		},
		handleVisiableChange(visiable) {
			if (visiable) {
				this.modify = 0;
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
