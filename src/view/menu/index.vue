<template>
	<layout-list
		ref="list"
		hasForm
		:query.sync="query"
		:list.sync="list"
		:listLoading.sync="listLoading"
		:cols="cols"
		:showExport="false"
		:showImport="false"
		:showForm="true"
		:showView="true"
		@search="handleSearch"
		@create="handleCreate"
		@delete="handleDelete"
		@update="handleUpdate"
		@view="handleView"
	>
		<menu-form ref="form" slot="form"></menu-form>
		<menu-view ref="view" slot="view"></menu-view>
		<template slot="search">
			<Input v-model="query.name" placeholder="请输入菜单名" clearable style="width: 200px"/>
		</template>
		<template slot-scope="{ row, index }" slot="action">
			<Button type="info" size="small" @click="handleDelete(row,index)">添加下级菜单</Button>
		</template>
	</layout-list>
</template>
<script>
import LayoutList from "@/components/LayoutList";
import MenuForm from "@/view/user/form";
import MenuView from "@/view/user/view";
function fmt(date) {
	if (date instanceof Date) {
		return `${date.getFullYear()}年${date.getMonth() +
			1}月${date.getDate()}日`;
	}
}
export default {
	components: {
		LayoutList,
		MenuForm,
		MenuView
	},
	data() {
		return {
			listLoading: false,
			query: { page: 1, limit: 10 },
			list: [
				{
					name: "admin",
					age: 21,
					address: "地球",
					loginDate: new Date()
				}
			],
			cols: [
				{ type: "selection", width: 60, align: "center" },
				{ type: "index", width: 80, align: "center" },
				{
					title: "Name",
					key: "name"
				},
				{
					title: "Age",
					key: "age"
				},
				{
					title: "LoginDate",
					render: (h, params) => {
						return h("span", fmt(params.row.loginDate));
					}
				},
				{
					title: "Address",
					key: "address"
				},
				{
					title: "Action",
					slot: "action",
					align: "center",
					width: 250
				}
			]
		};
	},
	methods: {
		handleSearch() {
			const _this = this;
			setTimeout(() => {
				_this.listLoading = false;
			}, 1000);
		},
		handleCreate() {
			this.$refs.form.show();
		},
		handleView(row, index) {
			this.$refs.view.show(row);
		},
		handleDelete(rows) {
			alert("delete " + rows.length);
		},
		handleUpdate(row, index) {
			this.$refs.form.show(row, "update");
		}
	}
};
</script>

