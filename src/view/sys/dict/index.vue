<template>
	<Layout class="full-container list-layout">
		<Layout>
			<Header class="list-header">
				<Button icon="ios-add-circle-outline" type="primary" @click="handleCreate">添加</Button>
				<!-- <Button icon="md-attach" type="info" @click="handleImport">导入</Button>
				<Button icon="md-download" type="success" @click="handleExport">导出</Button>-->
				<Button icon="ios-trash-outline" type="error" @click="handleDelete()">删除</Button>
				<Divider/>
				<Input v-model="query.type" placeholder="请输入字典类型" clearable style="width: 200px"/>
				<Input v-model="query.code" placeholder="请输入字典代码" clearable style="width: 200px"/>
				<Input v-model="query.label" placeholder="请输入字典标签" clearable style="width: 200px"/>
				<Input v-model="query.value" placeholder="请输入字典值" clearable style="width: 200px"/>
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
							<Button type="info" size="small" @click="handleChildren(row,index)">添加字典条目</Button>
							<Button type="primary" size="small" @click="handleUpdate(row,index)">编辑</Button>
							<Button type="error" size="small" @click="handleDelete([row])">删除</Button>
						</ButtonGroup>
					</template>
				</Table>
			</Content>
			<Footer class="list-footer">
				<Page
					:total="totalElemens"
					:current.sync="query.page"
					:page-size="query.limit"
					show-sizer
					show-elevator
					show-total
					transfer
					@on-change="handlePageChange"
					@on-page-size-change="handleLimitChange"
				></Page>
			</Footer>
		</Layout>
		<FormModal ref="form" @save="handleSearch"></FormModal>
		<ViewModal ref="view"></ViewModal>
	</Layout>
</template>
<script>
import FormModal from "./form";
import ViewModal from "./view";
import API from "@/api/dict";
export default {
	components: {
		FormModal,
		ViewModal
	},
	data() {
		return {
			query: {
				page: 1,
				limit: 10,
				type: null,
				code: null,
				label: null,
				value: null
			},
			totalElemens: 0,
			listLoading: true,
			currentRow: null,
			selectedRows: [],
			cols: [
				{
					type: "selection",
					width: 60,
					align: "center"
				},
				{
					type: "index",
					width: 80,
					align: "center",
					title: "序号"
				},
				{
					title: "类型",
					key: "type",
					align: "center"
				},
				{
					title: "代码",
					key: "code",
					align: "center"
				},
				{
					title: "标签",
					key: "label",
					align: "center"
				},
				{
					title: "值",
					key: "value",
					align: "center"
				},
				{
					title: "描述",
					key: "desceription",
					align: "center"
				},
				{
					title: "操作",
					slot: "action",
					width: 300,
					align: "center"
				}
			],
			list: []
		};
	},
	created() {
		this.handleSearch();
	},
	methods: {
		async handleSearch() {
			const _this = this;
			this.listLoading = true;
			let res = await API.Page(this.query);
			this.list = res.content;
			this.totalElemens = res.totalElements;
			this.listLoading = false;
		},
		handleReset() {
			this.query = {
				page: 1,
				limit: 10,
				type: null,
				label: null,
				value: null
			};
			this.handleSearch();
		},
		handleCreate() {
			this.$refs.form.show();
		},
		handleChildren(row, index) {
			this.$refs.form.show({ type: row.type, code: row.code });
		},
		handleExport() {},
		handleImport() {},
		handleView(row, index) {
			this.$refs.view.show(row);
		},
		handleUpdate(row, index) {
			this.$refs.form.show(row, "update");
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
		},
		handleTreeNodeClick(selected, currentNode) {}
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
