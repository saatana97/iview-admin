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
			<FormItem label="权限" prop="menus">
				<TreeSelection checkbox placeholder="请选择角色权限" :serialized="false" :data="menuTree"></TreeSelection>
			</FormItem>
			<FormItem label="备注" prop="description">
				<Input
					v-model="form.textarea"
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
import MenuApi from "@/api/menu";
export default {
	components: {
		TreeSelection
	},
	data() {
		return {
			visiable: false,
			loading: false,
			type: "create",
			menusName: "",
			form: {},
			menuTree: [],
			_form: "",
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
				]
			}
		};
	},
	async created() {
		let res = await MenuApi.Tree();
		this.menuTree = res.data || [];
	},
	methods: {
		show(row, type) {
			this.visiable = true;
			this.form = row ? JSON.parse(JSON.stringify(row)) : {};
			this._form = JSON.stringify(this.form);
			this.type = type || "create";
		},
		handleSave() {
			const _this = this;
			this.$refs.form.validate(res => {
				this.loading = true;
				if (res) {
					this.visiable = false;
				} else {
					setTimeout(() => {
						_this.loading = false;
					}, 1000);
				}
			});
		},
		handleVisiableChange(visiable) {
			if (!visiable) {
				this.loading = false;
				this.$refs.form.resetFields();
			}
		},
		handleCancel() {
			if (JSON.stringify(this.form) === this._form) {
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
	}
};
</script>
