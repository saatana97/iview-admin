/**
 * 数据列表页面模板
 * author 向文可
 * 插槽：
 	left 左侧部分，一般用来放树结构，默认无内容并且不显示
	oparetion 顶部操作按钮区域，默认包含添加按钮(showCreate:true)、导入按钮(showImport:true)、导出按钮(showExport:true)、删除按钮(showDelete:true)
			  虽然添加按钮默认显示，但是需要指定【form】插槽并且设置showForm为true才会显示
	search 查询条件区域(hasSearch:true)，默认无内容但是显示
	searchBtns 查询区域旁边的按钮(hasSearchBtns:true)，默认包含搜索按钮和重置按钮
	form 数据表单页面(showForm:false)，默认无内容并且不显示，有这个才会显示添加和编辑按钮
	view 数据展示页面(showView:false)，默认无内容并且不显示
	default 默认插槽，内容区域，默认内容为表格，并包含之后说明中的插槽，如果指定了此插槽的话默认内容中包含的所有插槽都会失效
	?table 表格里面的自定义的插槽，可以在cols里面指定列用指定插槽来显示
	?action 每行的操作按钮(showAction:true)，默认显示，包含(并且不会被覆盖，插槽内容显示在其之前)编辑按钮(同添加按钮需要设置showForm=true才会显示)、删除按钮(showDelete:true)
 * 参数：
	showLeft:false显示左侧区域、showOparetion:true显示顶部操作按钮区域、showCreate:true显示添加按钮、showExport:true显示导出按钮、showImport:true显示导入按钮
	showDelete:true显示删除按钮、showSearch:true显示搜索条件区域、showSearchBtns:true显示搜索\重置按钮、showAction:true显示每行最后一列为操作列、showPage:true显示分页区域
	showForm:false显示表单区域、showView:false显示详情区域、cols:[]指定表格显示的列、total:0数据总数
	-----------下面的是同步参数，指定时需要加.sync后缀--------------------------
	listLoading:false显示列表是否在加载中、list:[]显示在列表里面的数据、query:{page:1,limit:10}查询条件(页码、页容量)
 */
<template>
	<Layout class="full-container list-layout">
		<Sider class="list-sider" v-if="showLeft">
			<slot name="left"></slot>
		</Sider>
		<Layout>
			<Header class="list-header">
				<slot name="oparetion" v-if="showOparetion">
					<Button
						icon="ios-add-circle-outline"
						type="primary"
						@click="handleCreate"
						v-if="showCreate && showForm"
					>添加</Button>
					<Button icon="md-attach" type="info" @click="handleImport" v-if="showImport">导入</Button>
					<Button icon="md-download" type="success" @click="handleExport" v-if="showExport">导出</Button>
					<Button icon="ios-trash-outline" type="error" @click="handleDelete()" v-if="showDelete">删除</Button>
				</slot>
				<Divider v-if="showOparetion && showSearch"/>
				<slot name="search" v-if="showSearch"></slot>
				<slot name="searchBtns" v-if="showSearchBtns">
					<Button type="primary" icon="ios-search" :loading="listLoading" @click="handleSearch">搜索</Button>
					<Button type="info" ghost icon="md-refresh" :loading="listLoading" @click="handleSearch">重置</Button>
				</slot>
			</Header>
			<Content class="list-content">
				<slot>
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
						<slot name="table"></slot>
						<template slot-scope="{ row, index }" slot="action" v-if="showAction">
							<ButtonGroup>
								<slot name="action" :row="row" :index="index"></slot>
								<Button type="primary" size="small" @click="handleUpdate(row,index)" v-if="showForm">编辑</Button>
								<Button type="error" size="small" @click="handleDelete([row])" v-if="showDelete">删除</Button>
							</ButtonGroup>
						</template>
					</Table>
				</slot>
			</Content>
			<Footer class="list-footer" v-if="showPage">
				<Page
					:total="total"
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
		<slot name="form" v-if="showForm"></slot>
		<slot name="view" v-if="showView"></slot>
	</Layout>
</template>
<script>
export default {
	props: {
		showLeft: { default: false, type: Boolean },
		showOparetion: { default: true, type: Boolean },
		showCreate: { default: true, type: Boolean },
		showExport: { default: true, type: Boolean },
		showImport: { default: true, type: Boolean },
		showDelete: { default: true, type: Boolean },
		showSearch: { default: true, type: Boolean },
		showSearchBtns: { default: true, type: Boolean },
		showAction: { default: true, type: Boolean },
		showPage: { default: true, type: Boolean },
		showForm: { default: false, type: Boolean },
		showView: { default: false, type: Boolean },
		listLoading: { default: false, type: Boolean },
		total: { default: 0, type: Number },
		cols: {
			default() {
				return [];
			},
			type: Array
		},
		list: {
			default() {
				return [];
			},
			type: Array
		},
		query: {
			default() {
				return { page: 1, limit: 10 };
			},
			type: Object
		}
	},
	data() {
		return {
			selectedRows: []
		};
	},
	mounted() {
		this.handleSearch();
	},
	methods: {
		handleSearch() {
			this.$emit("update:listLoading", true);
			this.$emit("search");
		},
		handleCreate() {
			this.$emit("create");
		},
		handleExport() {
			this.$emit("export");
		},
		handleImport() {
			this.$emit("import");
		},
		handleView(row, index) {
			this.$emit("view", row, index);
		},
		handleUpdate(row, index) {
			this.$emit("update", row, index);
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
					onOk: () => {
						let newlist = _this.list.filter((item, index) => {
							let res = rows.find(temp => {
								return (
									JSON.stringify(temp) ===
									JSON.stringify(item)
								);
							});
							return !res;
						});
						_this.$emit("delete", rows);
						_this.$emit("update:list", newlist);
					}
				});
			}
		},
		handlePageChange(index) {
			this.$emit("update:query", { ...this.query, page: index });
			this.$emit("search");
		},
		handleLimitChange(size) {
			this.$emit("update:query", { ...this.query, limit: size });
			this.$emit("search");
		},
		handleRowChange(currentRow, lastRow) {
			this.$emit("update:current", currentRow);
			this.$emit("update:lastrow", lastRow);
		},
		handleSelectedChange(selected) {
			this.selectedRows = selected;
			this.$emit("selected", selected);
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
