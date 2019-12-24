<template>
	<div class="container flex-box row" v-loading="loading">
		<el-tree
			class="left"
			:data="leftTree"
			highlight-current
			default-expand-all
			:expand-on-click-node="false"
			:props="{
				label:'title'
			}"
			@node-click="handleLeftTreeNodeClick"
		></el-tree>
		<div class="right flex-box col">
			<div class="oparetion">
				<el-button v-if="permission.add" type="primary" @click="handleCreate">添加用户</el-button>
				<el-button v-if="permission.del" type="danger" @click="handleDelete()">批量删除</el-button>
			</div>
			<div class="search">
				<el-form ref="searchForm" :model="search" inline>
					<el-form-item label="用户名" prop="username">
						<el-input v-model="search.authorizer.username" clearable></el-input>
					</el-form-item>
					<el-form-item label="真实姓名" prop="name">
						<el-input v-model="search.name" clearable></el-input>
					</el-form-item>
					<el-form-item>
						<el-button @click="handleSearch" type="primary">搜索</el-button>
						<el-button @click="handleReset" type="success">重置</el-button>
					</el-form-item>
				</el-form>
			</div>
			<div class="content fill">
				<el-table
					row-key="id"
					:data="list"
					tooltip-effect="dark"
					@selection-change="handleSelectionChange"
				>
					<el-table-column type="selection" width="55" v-if="permission.del"></el-table-column>
					<el-table-column type="index" label="序号" width="55" v-else></el-table-column>
					<el-table-column prop="authorizer.username" label="用户名" show-overflow-tooltip></el-table-column>
					<el-table-column prop="name" label="真实姓名" show-overflow-tooltip></el-table-column>
					<el-table-column prop="org.title" label="所属组织机构" show-overflow-tooltip></el-table-column>
					<el-table-column prop="age" label="年龄" show-overflow-tooltip></el-table-column>
					<el-table-column prop="sex" label="性别" show-overflow-tooltip>
						<template slot-scope="scope">
							<span>{{opts.sex[scope.row.sex]}}</span>
						</template>
					</el-table-column>
					<el-table-column prop="createDate" label="创建时间" width="150px"></el-table-column>
					<el-table-column label="操作" v-if="permission.del || permission.edit">
						<template slot-scope="scope">
							<el-button v-if="permission.edit" type="primary" @click="handleUpdate(scope.row.id)">编辑</el-button>
							<el-button type="danger" @click="handleDelete([scope.row.id])" v-if="permission.del">删除</el-button>
						</template>
					</el-table-column>
				</el-table>
			</div>
			<div class="pagination">
				<el-pagination
					class="flex-box row row-end"
					@size-change="handleSizeChange"
					@current-change="handleCurrentChange"
					:current-page="search.page"
					:page-sizes="[10, 20, 30, 50]"
					:page-size="search.limit"
					layout="total, prev, pager, next, sizes"
					:total="total"
				></el-pagination>
			</div>
		</div>
		<router-view />
	</div>
</template>
<script>
import UserAPI from "@/api/user";
import OrgAPI from "@/api/org";
import DictAPI from "@/api/dict";
import TreeUtils from "@/utils/TreeUtils";
export default {
	name: "UserManager",
	data() {
		return {
			loading: false,
			leftTree: [],
			search: {
				authorizer: {
					username: null
				},
				org: {
					id: null
				},
				name: null,
				page: 1,
				limit: 10
			},
			list: [],
			total: 0,
			selection: [],
			opts: {
				sex: ["女", "男"]
			},
			permission: {
				add: this.$store.hasPermission("CreateUser"),
				edit: this.$store.hasPermission("UpdateUser"),
				del: this.$store.hasPermission("DeleteUser")
			}
		};
	},
	mounted() {
		this.handleLoadDept();
		this.handleLoadDict();
		this.handleSearch();
	},
	beforeRouteUpdate(to, from, next) {
		next();
		this.handleSearch();
	},
	methods: {
		async handleSearch() {
			this.loading = true;
			let search = { ...this.search };
			if (!search.org.id) {
				delete search.org;
			}
			let res = await UserAPI.Page(search);
			this.list = res.content || [];
			this.total = res.totalElements;
			let pageCount = Math.max(
				1,
				Math.ceil(this.total / this.search.limit)
			);
			if (pageCount < this.search.page) {
				this.search.page = pageCount;
				this.handleSearch();
			}
			this.loading = false;
		},
		handleReset() {
			this.$refs.searchForm.resetFields();
			this.handleSearch();
		},
		async handleLoadDict() {
			let res = await DictAPI.Check({ type: "性别" });
			this.opts.sex = [];
			res.forEach(item => {
				this.opts.sex[item.value] = item.label;
			});
		},
		async handleLoadDept() {
			let res = await OrgAPI.Tree();
			this.depts = res || [];
			this.leftTree = [
				{
					title: "全部",
					data: {
						id: null
					},
					children: this.depts
				}
			];
		},
		handleLeftTreeNodeClick(node) {
			this.search.org.id = node.data.id;
			this.handleSearch();
		},
		handleSelectable(row) {
			return !row.children || row.children.length === 0;
		},
		handleCreate() {
			this.$router.push({ name: "CreateUser" });
		},
		handleUpdate(id) {
			this.$router.push({ name: "UpdateUser", query: { id } });
		},
		async handleDelete(rows) {
			rows = rows || this.selection;
			if (rows.length === 0) {
				this.$message({
					showClose: true,
					message: "请至少选择一条要删除的数据",
					type: "warning"
				});
			} else {
				try {
					rows = rows.join(",");
					await this.$confirm("确定要删除当前选择的数据吗？");
					let res = await UserAPI.RemoveAll(rows);
					if (res.code === 200) {
						this.$message({
							showClose: true,
							message: "删除成功",
							type: "success"
						});
						this.handleSearch();
					} else {
						this.$message.error(res.msg || "删除失败");
					}
				} catch (e) {}
			}
		},
		handleSelectionChange(selection) {
			this.selection = selection.map(item => {
				return item.id;
			});
		},
		handleSizeChange(size) {
			this.search.limit = size;
			this.handleSearch();
		},
		handleCurrentChange(page) {
			this.search.page = page;
			this.handleSearch();
		}
	}
};
</script>
<style lang="scss" scoped>
</style>
