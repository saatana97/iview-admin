<template>
	<k-window :title="text[type] + '菜单'" visible width="30%" :close-on-click-modal="false" :close-on-press-escape="false" @close="handleClose">
		<el-form :rules="rule" ref="form" label-width="100px" :model="form" v-loading="loading">
			<el-form-item label="上级菜单" prop="parentName">
				<el-input v-model="form.parentName" readonly placeholder="不选表示这是一个顶级菜单">
					<tree-dialog slot="append" :data.sync="tree" :props="{ label: 'title' }" :show-checkbox="false" :handleFilterTree="handleFilterTree" @ok="handleCheckParent" @clear="handleCheckParent(false)"></tree-dialog>
				</el-input>
			</el-form-item>
			<el-form-item label="菜单名称" prop="title">
				<el-input v-model="form.title" clearable></el-input>
			</el-form-item>
			<el-form-item label="菜单权限" prop="code">
				<el-input v-model="form.code" clearable></el-input>
			</el-form-item>
			<el-form-item label="菜单路由" prop="router">
				<el-input v-model="form.router" clearable></el-input>
			</el-form-item>
			<el-form-item label="是否显示" prop="display">
				<el-switch v-model="form.display"></el-switch>
			</el-form-item>
			<el-form-item label="菜单图标" prop="icon">
				<el-input v-model="form.icon" readonly>
					<icon-picker slot="append" @pick="handlePick"></icon-picker>
				</el-input>
			</el-form-item>
			<el-form-item label="菜单排序" prop="sort">
				<el-input-number v-model="form.sort" clearable :min="0" :step="10"></el-input-number>
			</el-form-item>
		</el-form>
		<div slot="footer" class="dialog-footer">
			<el-button @click="handleClose">取 消</el-button>
			<el-button type="primary" :loading="loading" @click="handleSave">保 存</el-button>
		</div>
	</k-window>
</template>
<script>
import MenuAPI from '@/api/menu';
import TreeDialog from '@/components/TreeDialog';
import IconPicker from '@/components/IconPicker';
import TreeUtils from '@/utils/TreeUtils';
import ObjectUtils from '@/utils/ObjectUtils';

export default {
	name: 'MenuForm',
	components: {
		TreeDialog,
		IconPicker
	},
	data() {
		const _this = this;
		return {
			loading: false,
			type: 'create', //表单模式
			text: { create: '添加', update: '编辑' }, //表单模式对应文本
			form: {
				id: null,
				parentId: null,
				title: null,
				code: null,
				display: true,
				router: null,
				icon: null,
				sort: 0,
				parentName: ''
			},
			old: {},
			opts: {
				display: [
					{ label: '是', value: true },
					{ label: '否', value: false }
				]
			},
			rule: {
				title: [
					{ required: true, message: '菜单名称不能为空' },
					{
						async validator(rule, value, cb) {
							if (value === _this.old.title) {
								cb();
							} else {
								let res = await MenuAPI.Check({
									title: value
								});
								if (res.length === 0) {
									cb();
								} else {
									cb('菜单名称不能重复');
								}
							}
						}
					}
				],
				code: [
					{ required: true, message: '菜单权限不能为空' },
					{
						async validator(rule, value, cb) {
							if (value === _this.old.code) {
								cb();
							} else {
								let res = await MenuAPI.Check({
									code: value
								});
								if (res.length === 0) {
									cb();
								} else {
									cb('菜单权限不能重复');
								}
							}
						}
					}
				],
				router: [{ required: true, message: '菜单路由不能为空' }]
			},
			tree: [],
			list: []
		};
	},
	watch: {
		'form.parentName'(value) {
			if (!value) {
				this.form.parentId = null;
			}
		}
	},
	methods: {
		// 表单关闭
		handleClose() {
			this.$refs.form.resetFields();
			this.$router.push({ name: 'MenuManager' });
		},
		handlePick(icon) {
			this.form.icon = icon;
		},
		async handleLoadMenu() {
			let res = await MenuAPI.List();
			this.list = res;
			this.tree = TreeUtils.Build(res, 'id', 'parentId', 'children');
		},
		//提交表单
		async handleSave() {
			try {
				await this.$refs.form.validate();
				this.loading = true;
				let Save = this.type === 'create' ? MenuAPI.Create : MenuAPI.Update;
				let res = await Save(this.form);
				if (res) {
					this.$message({
						showClose: true,
						message: '保存成功',
						type: 'success'
					});
					this.handleClose();
				}
				this.loading = false;
			} catch (e) {
				console.info(e);
			}
		},
		handleFilterTree(node) {
			return node.id !== this.form.id && node.parentId !== this.form.id;
		},
		handleCheckParent(node) {
			if (node) {
				this.form.parentName = node.title;
				this.form.parentId = node.id;
				this.form.orderNum = (node.children.length + 1) * 10;
				if (!this.form.url) {
					this.form.url = node.url;
				}
			} else {
				this.form.orderNum = (this.tree.length + 1) * 10;
				this.form.parentName = null;
				this.form.parentId = null;
			}
		}
	},
	async mounted() {
		this.loading = true;
		await this.handleLoadMenu();
		let id = this.$route.query.id;
		if (id) {
			this.type = 'update';
			let res = await MenuAPI.Get(id);
			if (res) {
				ObjectUtils.Copy(res, this.form, true);
			} else {
				this.$message.error('无效的ID');
				this.handleClose();
			}
		} else {
			this.form.sort = (this.tree.length + 1) * 10;
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
				this.form.sort = (parent.children.length + 1) * 10;
				if (!this.form.router) {
					this.form.router = parent.router;
				}
			}
		}
		this.old = { ...this.form };
		this.loading = false;
	}
};
</script>
