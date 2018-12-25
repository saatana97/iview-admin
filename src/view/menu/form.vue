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
			<span>添加菜单</span>
		</template>
		<template slot="header" v-else>
			<Icon type="ios-create"/>
			<span>编辑菜单</span>
		</template>
		<Form :model="form" :rules="rules" :label-width="80" ref="form">
			<FormItem label="名称" prop="title">
				<Input v-model="form.title" clearable placeholder="请输入菜单名称"></Input>
			</FormItem>
			<FormItem label="代码" prop="code">
				<Input v-model="form.code" clearable placeholder="请输入菜单代码"></Input>
			</FormItem>
			<FormItem label="路径" prop="router">
				<Input v-model="form.router" clearable placeholder="请输入菜单路由路径"></Input>
			</FormItem>
			<FormItem label="图标" prop="icon">
				<Input v-model="form.icon" clearable placeholder="请输入菜单图标"></Input>
			</FormItem>
			<FormItem label="排序" prop="sort">
				<InputNumber v-model="form.sort" style="width:100%;"></InputNumber>
			</FormItem>
			<FormItem label="上级菜单" prop="parent">
				<TreeSelection placeholder="请选择上级菜单" title="请选择上级菜单" :data="tree" @ok="handleTreeOk"></TreeSelection>
			</FormItem>
			<FormItem label="备注" prop="description">
				<Input
					v-model="form.textarea"
					type="textarea"
					:autosize="{minRows: 2,maxRows: 5}"
					placeholder="Enter something..."
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
import MenuApi from "@/api/menu";
import TreeSelection from "@/components/TreeSelection";
export default {
	components: {
		TreeSelection
	},
	data() {
		return {
			visiable: false,
			loading: false,
			type: "create",
			form: {},
			_form: "",
			tree: [],
			rules: {
				title: [
					{
						required: true,
						message: "菜单名称不能为空",
						trigger: "change"
					}
				],
				code: [
					{
						required: true,
						message: "菜单代码不能为空",
						trigger: "change"
					}
				],
				router: [
					{
						required: true,
						message: "菜单路径不能为空",
						trigger: "change"
					}
				]
			}
		};
	},
	async created() {
		this.tree = await MenuApi.Tree();
	},
	methods: {
		show(row, type) {
			this.visiable = true;
			this.form = row ? JSON.parse(JSON.stringify(row)) : {};
			this._form = JSON.stringify(this.form);
			this.type = type || "create";
		},
		handleTreeOk(arr) {
			this.form.parent = arr[0];
		},
		handleSave() {
			const _this = this;
			this.$refs.form.validate(async res => {
				this.loading = true;
				if (res) {
					let Save = _this.form.id ? MenuApi.Update : MenuApi.Create;
					await Save(this.form);
					this.$emit("save", this.form);
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
