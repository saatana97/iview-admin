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
		:showLeft="true"
		:showForm="true"
		:showView="true"
		:showPage="false"
		@search="handleSearch"
		@create="handleCreate"
		@delete="handleDelete"
		@update="handleUpdate"
		@view="handleView"
	>
		<FormModal ref="form" slot="form" @save="handleSearch"></FormModal>
		<ViewModal ref="view" slot="view"></ViewModal>
		<template slot="search">
			<Input v-model="query.name" placeholder="请输入菜单名" clearable style="width: 200px"/>
		</template>
		<template slot="left">
			<Tree :data="menus" @on-select-change="handleTreeNodeClick"></Tree>
		</template>
		<template slot-scope="{ row, index }" slot="action">
			<Button type="info" size="small" @click="handleDelete(row,index)">添加下级菜单</Button>
		</template>
	</layout-list>
</template>
<script>
import MenuApi from "@/api/menu";
import LayoutList from "@/components/LayoutList";
import FormModal from "./form";
import ViewModal from "./view";
function fmt(date) {
	if (date instanceof Date) {
		return `${date.getFullYear()}年${date.getMonth() +
			1}月${date.getDate()}日`;
	}
}
export default {
	components: {
		LayoutList,
		FormModal,
		ViewModal
	},
	data() {
		return {
			listLoading: false,
			query: { page: 1, limit: 10 },
			list: [],
			cols: [
				{ type: "selection", width: 60, align: "center" },
				{ type: "index", title: "序号", width: 80, align: "center" },
				{
					title: "名称",
					key: "title"
				},
				{
					title: "代码",
					key: "code"
				},
				{
					title: "路由",
					key: "router"
				},
				{
					title: "操作",
					slot: "action",
					align: "center",
					width: 250
				}
			],
			menus: [
				{
					title: "系统设置",
					expand: true,
					code: "systemSetting",
					router: "/sys",
					children: [
						{
							title: "菜单管理",
							expand: true,
							code: "menuManager",
							router: "/sys/menu"
						},
						{
							title: "用户管理",
							expand: true,
							code: "userManager",
							router: "/sys/user"
						}
					]
				},
				{
					title: "个人中心",
					expand: true,
					code: "owner",
					router: "/owner",
					children: [
						{
							title: "个人资料",
							expand: true,
							code: "userInfo",
							router: "/owner/userinfo"
						},
						{
							title: "通讯录",
							expand: true,
							code: "concact",
							router: "/owner/concact"
						}
					]
				}
			]
		};
	},
	created() {
		this.handleSearch();
	},
	methods: {
		async handleSearch() {
			const _this = this;
			this.menus = await MenuApi.Tree();
			this.list = this.handleTreeToArray(this.menus);
			_this.listLoading = false;
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
		},
		handleTreeNodeClick(arr, node) {
			if (arr.length === 0) {
				arr = this.menus;
			}
			this.list = this.handleTreeToArray(arr);
		},
		handleTreeToArray(arr) {
			let res = [];
			(function scanle(arr, res) {
				if (arr instanceof Array) {
					arr.forEach(item => {
						res.push(item);
						scanle(item.children, res);
					});
				}
			})(arr, res);
			return res;
		}
	}
};
</script>

