<template>
	<Layout class="full-container list-layout">
		<Sider class="list-sider">
			<Tree :data="leftTree" @on-select-change="handleTreeNodeClick"></Tree>
		</Sider>
		<Layout>
			<Header class="list-header">
				<Button
					icon="ios-add-circle-outline"
					type="primary"
					v-if="permission.add"
					@click="handleCreate"
				>添加</Button>
				<!-- <Button icon="md-attach" type="info" @click="handleImport">导入</Button>
				<Button icon="md-download" type="success" @click="handleExport">导出</Button>-->
				<Button icon="ios-trash-outline" type="error" v-if="permission.del" @click="handleDelete()">删除</Button>
				<Divider/>
				<Input v-model="query.name" placeholder="请输入姓名" clearable style="width: 200px"/>
				<Input v-model="query.authorizer.username" placeholder="请输入用户名" clearable style="width: 200px"/>
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
					<template slot-scope="{ row, index }" slot="username">{{row.authorizer.username}}</template>
					<template slot-scope="{ row, index }" slot="action">
						<ButtonGroup>
							<Button type="primary" size="small" v-if="permission.upd" @click="handleUpdate(row,index)">编辑</Button>
							<Button type="error" size="small" v-if="permission.del" @click="handleDelete([row])">删除</Button>
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
import UserAPI from "@/api/user";
import AuthAPI from "@/api/auth";
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
				authorizer: {}
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
					title: "姓名",
					key: "name",
					align: "center"
				},
				{
					title: "用户名",
					slot: "username",
					align: "center"
				},
				{
					title: "地址",
					key: "address",
					align: "center"
				},
				{
					title: "操作",
					slot: "action",
					width: 150,
					align: "center"
				}
			],
			list: [],
			leftTree: [],
			permission: {
				add: false,
				upd: false,
				del: false,
				imp: false,
				exp: false
			}
		};
	},
	created() {
		this.handlePermission();
		this.handleSearch();
	},
	methods: {
		async handlePermission() {
			this.permission.add = await AuthAPI.Permission("addUser");
			this.permission.upd = await AuthAPI.Permission("updUser");
			this.permission.del = await AuthAPI.Permission("delUser");
			this.permission.imp = await AuthAPI.Permission("impUser");
			this.permission.exp = await AuthAPI.Permission("expUser");
			console.info(this.permission);
		},
		async handleSearch() {
			const _this = this;
			this.listLoading = true;
			let res = await UserAPI.Page(this.query);
			this.list = res.content;
			this.totalElemens = res.totalElements;
			this.listLoading = false;
		},
		handleReset() {
			this.query = { page: 1, limit: 10, authorizer: {} };
			this.handleSearch();
		},
		handleCreate() {
			this.$refs.form.show();
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
						await UserAPI.RemoveAll(ids);
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
