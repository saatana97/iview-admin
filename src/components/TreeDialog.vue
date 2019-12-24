<template>
	<div class="xwk-tree-dialog">
		<el-button-group>
			<el-button type="danger" @click="handleClear">
				<slot name="clear">清除</slot>
			</el-button>
			<el-button type="primary" @click="handleShowDialog">
				<slot>选择</slot>
			</el-button>
		</el-button-group>
		<k-window append-to-body :visible="visiable" :title="title" width="max-content" @close="handleClose">
			<el-input v-model="text" clearable placeholder="请输入查询条件" v-if="handleSearch"></el-input>
			<el-tree
				class="tree-dialog"
				v-if="visiable"
				ref="tree"
				:data="data"
				:props="props"
				:show-checkbox="showCheckbox"
				:expand-on-click-node="showCheckbox"
				accordion
				:check-strictly="!checkParent"
				:default-checked-keys="defaultChecked"
				:default-expand-all="defaultExpandAll"
				:filter-node-method="handleFilter"
			></el-tree>
			<div slot="footer">
				<el-button @click="handleClose">取 消</el-button>
				<el-button type="primary" @click="handleSave">确 定</el-button>
			</div>
		</k-window>
	</div>
</template>
<script>
export default {
	name: 'TreeDialog',
	props: {
		title: {
			type: String,
			default: '请选择'
		},
		data: {
			type: Array,
			default() {
				return [];
			}
		},
		props: {
			type: Object,
			default() {
				return {};
			}
		},
		showCheckbox: {
			type: Boolean,
			default: false
		},
		checkParent: {
			type: Boolean,
			default: true
		},
		defaultChecked: {
			type: Array,
			default() {
				return [];
			}
		},
		defaultExpandAll: {
			type: Boolean,
			default: true
		},
		label: {
			type: String,
			default: ''
		},
		handleFilterTree: {
			type: Function,
			default: node => true
		},
		handleSearch: {
			type: Function,
			default: null
		}
	},
	data() {
		return {
			text: null,
			visiable: false
		};
	},
	watch: {
		text(value) {
			this.$refs.tree.filter(value);
		}
	},
	methods: {
		handleFilter(text, node) {
			let res = true;
			res &= this.handleFilterTree(node);
			if (this.handleSearch && text != 'init') {
				res &= this.handleSearch(node, text);
			}
			return res;
		},
		handleClose() {
			this.visiable = false;
		},
		handleClear() {
			this.$emit('clear');
		},
		handleSave() {
			this.$emit('ok', this.showCheckbox ? this.$refs.tree.getCheckedNodes() : this.$refs.tree.getCurrentNode());
			this.handleClose();
		},
		handleShowDialog() {
			this.visiable = true;
			this.$nextTick(function() {
				this.$refs.tree.filter('init');
			});
		}
	}
};
</script>
<style lang="scss">
.xwk-tree-dialog {
	width: max-content;
	margin: 0;
	padding: 0;
}
.tree-dialog {
	&.el-tree {
		min-width: 300px;
		max-height: 50vh;
		overflow: auto;
		.el-tree-node {
			&.is-current {
				& > .el-tree-node__content {
					background: #409eff;
					color: white;
				}
			}
			&:not(.is-current) {
				& > .el-tree-node__content {
					background: white;
					color: #606266;
				}
			}
		}
	}
}
</style>
