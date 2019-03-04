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
		<Form :model="form" :rules="rules" :label-width="100" ref="form">
			<FormItem label="上级组织机构" prop="parent">
				<Input v-model="form.parent.title" clearable placeholder="请选择上级组织机构" readonly style="width:80%"></Input>
				<TreeSelection placeholder="请选择上级组织机构" title="请选择上级组织机构" :data="tree" @ok="handleTreeOk"></TreeSelection>
			</FormItem>
			<FormItem label="名称" prop="title">
				<Input v-model="form.title" clearable placeholder="请输入组织机构名称"></Input>
			</FormItem>
			<FormItem label="代码" prop="code">
				<Input v-model="form.code" clearable placeholder="请输入组织机构代码"></Input>
			</FormItem>
			<FormItem label="类型" prop="type">
				<Select v-model="form.type" clearable placeholder="请选择组织机构类型">
					<Option v-for="item in types" :value="item.value+''" :key="item.value">{{ item.label }}</Option>
				</Select>
			</FormItem>
			<FormItem label="级别" prop="level">
				<Select v-model="form.level" clearable placeholder="请选择组织机构级别" :disabled="!!form.parent.title">
					<Option v-for="item in levels" :value="item.value+''" :key="item.value">{{ item.label }}</Option>
				</Select>
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
import API from "@/api/org";
import DictAPI from "@/api/dict";
import TreeSelection from "@/components/TreeSelection";
export default {
	components: {
		TreeSelection
	},
	data() {
		const _this = this;
		return {
			visiable: false,
			loading: false,
			modify: 0,
			type: "create",
			form: { parent: {} },
			oldTitle: null,
			tree: [],
			types: [],
			levels: [],
			rules: {
				title: [
					{
						required: true,
						message: "组织机构名称不能为空",
						trigger: "change"
					},
					{
						async validator(rule, value, cb) {
							if (_this.oldTitle === value) {
								cb();
							} else {
								let res = await API.Check({
									title: value
								});
								if (res.length === 0) {
									cb();
								} else {
									cb(new Error("组织机构名称已存在"));
								}
							}
						},
						trigger: "blur"
					}
				],
				code: [
					{
						required: true,
						message: "组织机构代码不能为空",
						trigger: "change"
					}
				],
				type: [
					{
						required: true,
						message: "组织机构类型不能为空",
						trigger: "change"
					}
				],
				level: [
					{
						required: true,
						message: "组织机构级别不能为空",
						trigger: "change"
					}
				]
			}
		};
	},
	async created() {
		this.types = await DictAPI.List({ code: "orgType" });
		this.levels = await DictAPI.List({ code: "orgLevel" });
	},
	methods: {
		async show(row, type) {
			this.form = row ? { ...row } : this.form;
			if (!this.form.parent) {
				this.form.parent = {};
			}
			if (this.form.type) {
				this.form.type += "";
			} else {
				this.form.type = this.types[0].value + "";
			}
			if (this.form.level) {
				this.form.level += "";
			}
			this.oldTitle = this.form.title;
			if (row && row.parent && row.parent.level) {
				this.form.level = +row.parent.level + 1 + "";
			}
			this.type = type || "create";
			this.tree = await API.Tree();
			(function filterTree(arr, title, level) {
				if (arr instanceof Array && arr.length > 0) {
					for (let index = 0; index < arr.length; index++) {
						let item = arr[index];
						if (item.title === title) {
							arr.splice(index--, 1);
						} else {
							if (item.level + 1 === level) {
								delete item.children;
							} else if (item.level === level) {
								arr.splice(index--, 1);
							} else {
								filterTree(item.children, title, level);
							}
						}
					}
				}
			})(
				this.tree,
				this.form.title,
				this.levels
					.map(item => {
						return item.value;
					})
					.pop()
			);
			this.visiable = true;
		},
		handleTreeOk(arr) {
			this.form.parent = arr[0].data;
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
		},
		"form.parent.title"(value, old) {
			let sort = 0;
			if (!value) {
				this.form.parent.id = null;
				sort = (this.tree.length + 1) * 10;
			} else {
				this.form.level = +this.form.parent.level + 1 + "";
				let parent = (function searchTree(arr, title) {
					let res = null;
					if (arr instanceof Array) {
						arr.find(item => {
							let isFind = false;
							if (item.title === title) {
								res = item;
								isFind = true;
							} else {
								res = searchTree(item.children, title);
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
