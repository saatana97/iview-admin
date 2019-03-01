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
			<span>添加组织机构</span>
		</template>
		<template slot="header" v-else>
			<Icon type="ios-create"/>
			<span>编辑组织机构</span>
		</template>
		<Form :model="form" :rules="rules" :label-width="80" ref="form">
			<FormItem label="名称" prop="name">
				<Input v-model="form.name" clearable placeholder="请输入组织机构名称"></Input>
			</FormItem>
			<FormItem label="代码" prop="code">
				<Input v-model="form.code" clearable placeholder="请输入组织机构代码"></Input>
			</FormItem>
			<FormItem label="类型" prop="type">
				<Select v-model="form.type" clearable placeholder="请选择组织机构类型">
					<Option v-for="item in types" :value="item.value" :key="item.value">{{ item.label }}</Option>
				</Select>
			</FormItem>
			<FormItem label="级别" prop="level">
				<Select v-model="form.type" clearable placeholder="请选择组织机构级别">
					<Option v-for="item in levels" :value="item.value" :key="item.value">{{ item.label }}</Option>
				</Select>
			</FormItem>
			<FormItem label="上级组织机构" prop="parent">
				<Input v-model="form.parent.name" clearable placeholder="请选择上级组织机构" readonly style="width:80%"></Input>
				<TreeSelection placeholder="请选择上级组织机构" title="请选择上级组织机构" :data="tree" @ok="handleTreeOk"></TreeSelection>
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
import API from "@/api/menu";
import DictAPI from "@/api/dict";
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
			form: { parent: { title: "" } },
			_form: "",
			tree: [],
			types: [],
			levels: [],
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
		this.tree = await API.Tree();
		this.types = await API.List({ type: "orgType" });
		this.levels = await API.List({ type: "orgLevel" });
	},
	methods: {
		show(row, type) {
			this.visiable = true;
			this.form = row
				? JSON.parse(JSON.stringify(row))
				: { parent: { title: "" } };
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
					let data = { ...this.form };
					if (!data.parent.id) {
						delete data.parent;
					}
					let Save = data.id ? API.Update : API.Create;
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
	},
	watch: {
		"form.parent.name"(value, old) {
			let sort = 0;
			if (!value) {
				this.form.parent.id = null;
				sort = (this.tree.length + 1) * 10;
			} else {
				let parent = (function searchTree(arr, name) {
					let res = null;
					if (arr instanceof Array) {
						arr.find(item => {
							let isFind = false;
							if (item.name === name) {
								res = item;
								isFind = true;
							} else {
								res = searchTree(item.children, name);
							}
							return isFind;
						});
					}
					return res;
				})(this.tree, value);
				if (parent.children instanceof Array) {
					sort = (parent.children.length + 1) * 10;
				}
			}
			this.form.sort = sort;
		}
	}
};
</script>
