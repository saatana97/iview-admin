<template>
	<layout-list
		ref="list"
		hasForm
		:query.sync="query"
		:list.sync="list"
		:listLoading.sync="listLoading"
		:cols="cols"
		:total="totalElements"
		:showForm="true"
		:showView="true"
		:showExport="false"
		:showImport="false"
		@search="handleSearch"
		@create="handleCreate"
		@delete="handleDelete"
		@update="handleUpdate"
		@view="handleView"
	>
		<template slot="search">
			<Input v-model="query.username" placeholder="请输入角色名" clearable style="width: 200px"/>
		</template>
		<template slot="table">
			<template slot="menus" slot-scope="{ row, index }">{{row.menus.length}}</template>
		</template>
		<form-modal ref="form" slot="form"></form-modal>
		<view-modal ref="view" slot="view"></view-modal>
	</layout-list>
</template>
<script>
import RoleApi from "@/api/role";
import LayoutList from "@/components/LayoutList";
import FormModal from "./form";
import ViewModal from "./view";
export default {
	components: {
		LayoutList,
		FormModal,
		ViewModal
	},
	data() {
		return {
			query: {
				page: 1,
				limit: 10
			},
			totalElements: 100,
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
					title: "名称",
					key: "name"
				},
				{
					title: "代码",
					key: "code"
				},
				{
					title: "权限",
					key: "menus",
					slot: "menus"
				},
				{
					title: "操作",
					slot: "action",
					width: 150,
					align: "center"
				}
			],
			list: []
		};
	},
	methods: {
		async handleSearch() {
			const _this = this;
			let res = await RoleApi.Page(this.query);
			this.list = res.content;
			this.totalElements = res.totalElements;
			this.listLoading = false;
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
			alert("delete " + rows.length);
		}
	}
};
</script>
<style lang="scss" scoped>
.list-layout {
	background: white;
	.ivu-layout {
		padding: 0 10px;
		background: white;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}
}
* {
	/deep/ .list-header {
		background: #f8f8f9;
		margin: 10px 0;
		height: 16%;
		padding: 0 10px;
		/deep/ .ivu-divider {
			margin: 0;
		}
	}
	/deep/ .list-sider {
		background: #f8f8f9;
		margin: 10px;
	}
	/deep/ .list-content {
		height: 80%;
		overflow: auto;
	}
	/deep/ .list-footer {
		background: #f8f8f9;
		margin: 10px 0;
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
