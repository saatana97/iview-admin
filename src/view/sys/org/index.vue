<template>
	<Layout class="full-container list-layout">
		<Sider class="list-sider">
			<Tree :data="orgs" @on-select-change="handleTreeNodeClick"></Tree>
		</Sider>
		<Layout>
			<Header class="list-header">
				<Button icon="ios-add-circle-outline" type="primary" @click="handleCreate">添加</Button>
				<Button icon="ios-trash-outline" type="error" @click="handleDelete()">删除</Button>
				<Divider/>
				<Input v-model="query.title" placeholder="请输入组织机构名称" clearable style="width: 200px"/>
				<Button type="primary" icon="ios-search" :loading="listLoading" @click="handleSearch">搜索</Button>
				<Button type="info" ghost icon="md-refresh" :loading="listLoading" @click="handleReset">重置</Button>
			</Header>
			<Content class="list-content">
				<Table
					ref="table"
					border
					:columns="cols"
					:data="list"
					:loading="listLoading"
					highlight-row
					@on-row-dblclick="handleView"
					@on-current-change="handleRowChange"
					@on-selection-change="handleSelectedChange"
				>
					<template slot-scope="{ row, index }" slot="action">
						<ButtonGroup>
							<Button
								type="info"
								size="small"
								@click="handleChildren(row,index)"
								v-if="!isLastLevel(row.level)"
							>添加下级组织机构</Button>
							<Button type="primary" size="small" @click="handleUpdate(row,index)">编辑</Button>
							<Button type="error" size="small" @click="handleDelete([row])">删除</Button>
						</ButtonGroup>
					</template>
				</Table>
			</Content>
		</Layout>
		<FormModal ref="form" @save="handleSearch"></FormModal>
		<ViewModal ref="view"></ViewModal>
	</Layout>
</template>
<script>
import FormModal from "./form";
import ViewModal from "./view";
import API from "@/api/org";
import DictAPI from "@/api/dict";
export default {
	components: {
		FormModal,
		ViewModal
	},
	data() {
		const _this = this;
		return {
			query: {
				page: 1,
				limit: 10
			},
			listLoading: true,
			currentRow: null,
			selectedRows: [],
			cols: [
				{ type: "selection", width: 60, align: "center" },
				{ type: "index", title: "序号", width: 80, align: "center" },
				{
					title: "名称",
					key: "title",
					align: "center"
				},
				{
					title: "代码",
					key: "code",
					align: "center"
				},
				{
					title: "类型",
					key: "typeLabel",
					align: "center"
				},
				{
					title: "级别",
					key: "levelLabel",
					align: "center"
				},
				{
					title: "操作",
					slot: "action",
					align: "center",
					width: 300
				}
			],
			orgs: [],
			list: [],
			levels: []
		};
	},
	async created() {
		this.handleSearch();
		let res = await DictAPI.Check({ code: "orgLevel" });
		this.levels = res.map(item => {
			return item.value;
		});
	},
	methods: {
		async handleTypeLabel(value) {
			let res = await DictAPI.Query({ code: "orgType", value });
			return res;
		},
		async handleLevelLabel(value) {
			let res = await DictAPI.Query({ code: "orgLevel", value });
			return res;
		},
		async handleSearch() {
			const _this = this;
			this.orgs = await API.Tree();
			this.list = this.handleTreeToArray(this.orgs);
			this.handleFilter();
			_this.listLoading = false;
		},
		isLastLevel(level) {
			return this.levels.indexOf(level) === this.levels.length - 1;
		},
		handleFilter() {
			const _this = this;
			if (this.query.title) {
				this.list = this.list.filter(item => {
					return new RegExp(_this.query.title).test(item.title);
				});
			}
		},
		handleReset() {
			this.query = {
				page: 1,
				limit: 10
			};
			this.handleSearch();
		},
		handleCreate() {
			this.$refs.form.show();
		},
		handleView(row, index) {
			this.$refs.view.show({ ...row, parent: row.parent.data });
		},
		handleUpdate(row, index) {
			this.$refs.form.show({ ...row, parent: row.parent.data }, "update");
		},
		handleChildren(row, index) {
			this.$refs.form.show({ parent: row }, "create");
		},
		handleDelete(rows) {
			const _this = this;
			rows = rows || this.selectedRows;
			if (rows.length === 0) {
				this.$Modal.error({
					title: "操作有误",
					content: "请先选择要删除的数据",
					closable: true
				});
			} else {
				this.$Modal.confirm({
					title: "操作提示",
					content: `确定要删除这${rows.length}条数据吗？`,
					closable: true,
					onOk: async () => {
						let ids = rows.map(item => {
							return item.id;
						});
						await API.RemoveAll(ids);
						_this.handleSearch();
					}
				});
			}
		},
		handleTreeNodeClick(arr, node) {
			if (arr.length === 0) {
				arr = this.orgs;
			}
			this.list = this.handleTreeToArray(arr);
			this.handleFilter();
		},
		handleTreeToArray(arr) {
			let res = [];
			(function scanle(parent, arr, res) {
				if (arr instanceof Array) {
					arr.forEach(item => {
						item.data.parent = { ...parent, children: [] };
						res.push(item.data);
						scanle(item, item.children, res);
					});
				}
			})({}, arr, res);
			return res;
		},
		handlePageChange(index) {
			this.query.page = index;
			this.handleSearch();
		},
		handleLimitChange(size) {
			this.query.limit = size;
			this.handleSearch();
		},
		handleRowChange(currentRow, lastRow) {
			this.currentRow = currentRow;
		},
		handleSelectedChange(selected) {
			this.selectedRows = selected;
		}
	}
};
</script>
<style lang="scss" scoped>
.list-layout {
	background: white;
	.ivu-layout {
		padding: 10px;
		background: white;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}
}
* {
	/deep/ .list-header {
		border: 1px #e8eaec solid;
		background: #f8f8f9;
		height: 16%;
		padding: 0 10px;
		/deep/ .ivu-divider {
			margin: 0;
		}
	}
	/deep/ .list-sider {
		margin: 10px 0 10px 10px;
		padding: 10px;
		border: 1px #e8eaec solid;
		background: #f8f8f9;
	}
	/deep/ .list-content {
		height: 80%;
		margin-top: 10px;
		overflow: auto;
	}
	/deep/ .list-footer {
		border: 1px #e8eaec solid;
		margin-top: 10px;
		padding: 20px;
	}
	/deep/ .ivu-table-wrapper {
		height: 100%;
		/deep/ .ivu-table {
			.ivu-table-header {
				height: 40px;
			}
			.ivu-table-body {
				height: calc(100% - 40px);
				overflow-y: auto;
				overflow-x: hidden;
			}
			.ivu-table-footer {
				height: 0px;
			}
		}
	}
}
</style>
