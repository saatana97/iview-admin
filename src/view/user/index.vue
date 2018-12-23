<template>
	<Layout class="full-container list-layout">
		<Sider class="list-sider">
			<Tree :data="leftTree" @on-select-change="handleTreeNodeClick"></Tree>
		</Sider>
		<Layout>
			<Header class="list-header">
				<Button icon="ios-add-circle-outline" type="primary" @click="handleCreate">添加</Button>
				<Button icon="md-attach" type="info" @click="handleImport">导入</Button>
				<Button icon="md-download" type="success" @click="handleExport">导出</Button>
				<Button icon="ios-trash-outline" type="error" @click="handleDelete">删除</Button>
				<Divider/>
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
					<template slot-scope="{ row, index }" slot="action">
						<ButtonGroup>
							<Button type="primary" size="small" @click="handleUpdate(row,index)">编辑</Button>
							<Button type="error" size="small" @click="handleDelete(row,index)">删除</Button>
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
		<User-Form ref="userForm"></User-Form>
		<User-View ref="userView"></User-View>
	</Layout>
</template>
<script>
import UserForm from "./form";
import UserView from "./view";
export default {
	components: {
		UserForm,
		UserView
	},
	data() {
		return {
			query: {
				page: 1,
				limie: 10
			},
			selectOptions: { type: [] },
			searchTypeLoading: false,
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
				_this.listLoading = false;
			}, 1000);
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
		handleDelete(row, index) {
			const _this = this;
			this.$Modal.confirm({
				title: "操作提示",
				content: "确定要删除这条数据吗？",
				closable: true,
				onOk: () => {
					_this.list.splice(index, 1);
				}
			});
		},
		handlePageChange(index) {
			this.query.page = index;
		},
		handleLimitChange(size) {
			this.query.limie = size;
		},
		handleRowChange(currentRow, lastRow) {
			this.currentRow = currentRow;
		},
		handleSelectedChange(selected) {
			this.selectedRows = selected;
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
