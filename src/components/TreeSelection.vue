<template>
	<div class="tree-selection">
		<Button @click="handleClick" class="btn">
			<Icon type="md-options"/>
		</Button>
		<Modal
			v-model="showModal"
			:title="title"
			:closable="closable"
			:mask-closable="closable"
			@on-ok="handleOk"
			@on-cancel="handleCancel"
		>
			<Tree ref="tree" :data="serialization()" :show-checkbox="checkbox" :check-strictly="cascade"></Tree>
		</Modal>
	</div>
</template>
<script>
export default {
	props: {
		clearable: { default: true, type: Boolean },
		placeholder: { default: "请选择", type: String },
		serialized: { default: true, type: Boolean },
		title: { default: "请选择", type: String },
		closable: { default: true, type: Boolean },
		checkbox: { default: false, type: Boolean },
		cascade: { default: false, type: Boolean },
		ignoreParent: { default: false, type: Boolean },
		ignoreDisabled: { default: true, type: Boolean },
		disableParent: { default: false, type: Boolean },
		data: {
			default() {
				return [];
			},
			type: Array
		}
	},
	data() {
		return {
			label: "",
			showModal: false
		};
	},
	methods: {
		handleClick() {
			this.showModal = true;
		},
		handleOk() {
			const _this = this;
			let checked = this.checkbox
				? this.$refs.tree.getCheckedNodes()
				: this.$refs.tree.getSelectedNodes();
			if (this.ignoreParent) {
				checked = checked.filter(item => {
					return (
						!(
							item.children instanceof Array &&
							item.children.length > 0
						) &&
						(!_this.ignoreDisabled || !item.disabled)
					);
				});
			}
			this.label = "";
			checked.forEach(item => {
				_this.label += item.title + " ";
			});
			this.$emit("ok", checked);
		},
		handleCancel() {},
		serialization() {
			let res = [...this.data];
			if (!this.serialized) {
				try {
					res.sort((prev, next) => {
						return prev.parent && !next.parent ? 1 : -1;
					});
				} catch (e) {
					console.warn("排序失败", e);
				}
				function findParent(arr, id) {
					let res = false;
					if (arr instanceof Array) {
						arr.find(item => {
							let find = item.id === id;
							if (find) {
								res = item;
							} else {
								res = findParent(item.children, id);
							}
							return find;
						});
					}
					return res;
				}
				let root = [];
				res.forEach((item, index) => {
					let parent = findParent(res, item.parent);
					if (parent) {
						let arr = parent.children || [];
						arr.push(item);
						parent.children = arr;
					} else {
						root.push(item);
					}
				});
				res = root;
			}
			return res;
		}
	}
};
</script>
<style lang="scss" scoped>
.tree-selection {
	float: right;
	.btn {
		padding: 3px 10px;
		width: 50px;
	}
}
/deep/ .ivu-modal {
	width: max-content !important;
	min-width: 300px;
	/deep/ .ivu-modal-body {
		padding: 20px 50px;
		/deep/ .ivu-tree-empty {
			text-align: center;
		}
	}
}
</style>
