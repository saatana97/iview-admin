<template>
	<Layout class="full-container list-layout">
		<Sider class="list-sider">
			<Tree :data="leftTree" @on-select-change="handleTreeNodeClick"></Tree>
		</Sider>
		<Layout>
			<Header class="list-header">
				<Button icon="ios-add-circle-outline" type="primary" @click="handleCreate">添加</Button>
				<!-- <Button icon="md-attach" type="info" @click="handleImport">导入</Button>
				<Button icon="md-download" type="success" @click="handleExport">导出</Button>-->
				<Button icon="ios-trash-outline" type="error" @click="handleDelete()">删除</Button>
				<Divider/>
				<Input v-model="query.name" placeholder="请输入姓名" clearable style="width: 200px"/>
				<Input v-model="query.authorizer.username" placeholder="请输入用户名" clearable style="width: 200px"/>
				<Button type="primary" icon="ios-search" :loading="listLoading" @click="handleSearch">搜索</Button>
				<Button type="info" ghost icon="md-refresh" :loading="listLoading" @click="handleSearch">重置</Button>
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
					<template slot-scope="{ row, index }" slot="username">{{row.authorizer.username}}</template>
					<template slot-scope="{ row, index }" slot="action">
						<ButtonGroup>
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
		<User-Form ref="userForm" @save="handleSearch"></User-Form>
		<User-View ref="userView"></User-View>
	</Layout>
</template>
<script>
import UserForm from "./form";
import UserView from "./view";
import UserApi from "@/api/user";
export default {
	components: {
		UserForm,
		UserView
	},
	data() {
		return {
			query: {
				page: 1,
				limie: 10,
				authorizer: {}
			},
			totalElemens: 20,
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
					title: "姓名",
					key: "name"
				},
				{
					title: "用户名",
					slot: "username"
				},
				{
					title: "地址",
					key: "address"
				},
				{
					title: "操作",
					slot: "action",
					width: 150,
					align: "center"
				}
			],
			list: [],
			leftTree: []
		};
	},
	created() {
		this.handleSearch();
	},
	methods: {
		async handleSearch() {
			const _this = this;
			this.listLoading = true;
			let res = await UserApi.Page(this.query);
			this.list = res.content;
			this.totalElemens = res.totalElemens;
			this.listLoading = false;
		},
		handleCreate() {
			this.$refs.userForm.show();
		},
		handleExport() {},
		handleImport() {},
		handleView(row, index) {
			this.$refs.userView.show(row);
		},
		handleUpdate(row, index) {
			this.$refs.userForm.show(row, "update");
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
						await UserApi.RemoveAll(ids);
						_this.handleSearch();
					}
				});
			}
		},
		handlePageChange(index) {
			this.query.page = index;
		},
		handleLimitChange(size) {
			this.query.limit = size;
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
