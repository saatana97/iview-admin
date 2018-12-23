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
		:showLeft="true"
		@search="handleSearch"
		@create="handleCreate"
		@delete="handleDelete"
		@update="handleUpdate"
		@export="handleExport"
		@import="handleImport"
		@view="handleView"
	>
		<template slot="left">
			<Tree :data="leftTree" @on-select-change="handleTreeNodeClick"></Tree>
		</template>
		<template slot="search">
			<Input v-model="query.username" placeholder="请输入用户名" clearable style="width: 200px"/>
			<Select
				style="width:200px;"
				v-model="query.type"
				filterable
				remote
				clearable
				transfer
				:remote-method="handleSearchTypeLoad"
				:loading="searchTypeLoading"
			>
				<Option
					v-for="(option, index) in selectOptions.type"
					:value="option.value"
					:key="index"
				>{{option.label}}</Option>
			</Select>
			<DatePicker type="daterange" placement="bottom-end" placeholder="请选择日期范围" style="width: 200px"></DatePicker>
		</template>
		<user-form ref="form" slot="form"></user-form>
		<user-view ref="view" slot="view"></user-view>
	</layout-list>
</template>
<script>
import LayoutList from "@/components/LayoutList";
import UserForm from "./form";
import UserView from "./view";
export default {
	components: {
		LayoutList,
		UserForm,
		UserView
	},
	data() {
		return {
			query: {
				page: 1,
				limit: 10
			},
			selectOptions: { type: [] },
			searchTypeLoading: false,
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
					title: "姓名",
					key: "name"
				},
				{
					title: "年龄",
					key: "age"
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
			list: [
				{
					name: "admin",
					age: 21,
					address: "地球"
				},
				{
					name: "test1",
					age: 21,
					address: "地球"
				},
				{
					name: "test2",
					age: 21,
					address: "地球"
				},
				{
					name: "test3",
					age: 21,
					address: "地球"
				},
				{
					name: "test4",
					age: 21,
					address: "地球"
				},
				{
					name: "test5",
					age: 21,
					address: "地球"
				}
			],
			leftTree: [
				{
					title: "parent 1",
					expand: true,
					children: [
						{
							title: "parent 1-1",
							expand: true,
							children: [
								{
									title: "leaf 1-1-1"
								},
								{
									title: "leaf 1-1-2"
								}
							]
						},
						{
							title: "parent 1-2",
							expand: true,
							children: [
								{
									title: "leaf 1-2-1"
								},
								{
									title: "leaf 1-2-1"
								}
							]
						}
					]
				}
			]
		};
	},
	mounted() {
		const _this = this;
		setTimeout(function() {
			_this.listLoading = false;
		}, 1000);
	},
	methods: {
		handleSearch() {
			const _this = this;
			this.listLoading = true;
			setTimeout(function() {
				_this.list = [];
				for (let i = 0; i < _this.query.limit; i++) {
					if (
						_this.list.length ===
						_this.totalElements -
							(_this.query.page - 1) * _this.query.limit
					) {
						break;
					}
					_this.list.push({
						name:
							"test" +
							(i +
								1 +
								(_this.query.page - 1) * _this.query.limit),
						age: 21,
						address: "地球"
					});
				}
				_this.listLoading = false;
			}, 1000);
		},
		handleCreate() {
			this.$refs.form.show();
		},
		handleExport() {},
		handleImport() {},
		handleView(row, index) {
			this.$refs.userView.show(row);
		},
		handleUpdate(row, index) {
			this.$refs.form.show(row, "update");
		},
		handleDelete(rows) {
			alert("delete " + rows.length);
		},
		handleTreeNodeClick(selected, currentNode) {},
		handleSearchTypeLoad(query) {
			if (query !== "") {
				this.searchTypeLoading = true;
				setTimeout(() => {
					this.searchTypeLoading = false;
					const list = [
						"Alabama",
						"Alaska",
						"Arizona",
						"Arkansas",
						"California",
						"Colorado",
						"Connecticut",
						"Delaware",
						"Florida",
						"Georgia",
						"Hawaii",
						"Idaho",
						"Illinois",
						"Indiana",
						"Iowa",
						"Kansas",
						"Kentucky",
						"Louisiana",
						"Maine",
						"Maryland",
						"Massachusetts",
						"Michigan",
						"Minnesota",
						"Mississippi",
						"Missouri",
						"Montana",
						"Nebraska",
						"Nevada",
						"New hampshire",
						"New jersey",
						"New mexico",
						"New york",
						"North carolina",
						"North dakota",
						"Ohio",
						"Oklahoma",
						"Oregon",
						"Pennsylvania",
						"Rhode island",
						"South carolina",
						"South dakota",
						"Tennessee",
						"Texas",
						"Utah",
						"Vermont",
						"Virginia",
						"Washington",
						"West virginia",
						"Wisconsin",
						"Wyoming"
					].map(item => {
						return {
							value: item,
							label: item
						};
					});
					this.selectOptions.type = list.filter(
						item =>
							item.label
								.toLowerCase()
								.indexOf(query.toLowerCase()) > -1
					);
				}, 200);
			} else {
				this.selectOptions.type = [];
			}
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
