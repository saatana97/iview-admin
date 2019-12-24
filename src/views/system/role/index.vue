<template>
	<div class="container flex-box row" v-loading="loading">
		<div class="right flex-box col">
			<div class="oparetion">
				<el-button v-if="permission.add" type="primary" @click="handleCreate">添加角色</el-button>
				<el-button v-if="permission.del" type="danger" @click="handleDelete()">批量删除</el-button>
			</div>
			<div class="search">
				<el-form ref="searchForm" :model="search" inline>
					<el-form-item label="角色名" prop="name">
						<el-input v-model="search.name" clearable></el-input>
					</el-form-item>
					<el-form-item>
						<el-button @click="handleSearch" type="primary">搜索</el-button>
						<el-button @click="handleReset" type="success">重置</el-button>
					</el-form-item>
				</el-form>
			</div>
			<div class="content fill">
				<el-table :data="list" tooltip-effect="dark" @selection-change="handleSelectionChange">
					<el-table-column type="selection" width="55" v-if="permission.del"></el-table-column>
					<el-table-column type="index" label="序号" width="55" v-else></el-table-column>
					<el-table-column prop="name" label="角色名称" show-overflow-tooltip></el-table-column>
					<el-table-column prop="code" label="角色代码" show-overflow-tooltip></el-table-column>
					<el-table-column prop="description" label="备注" show-overflow-tooltip></el-table-column>
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
import RoleAPI from '@/api/role';
export default {
	name: 'RoleManager',
	data() {
		return {
			loading: false,
			search: {
				name: null,
				page: 1,
				limit: 10
			},
			list: [],
			total: 0,
			selection: [],
			permission: {
				add: this.$store.hasPermission('CreateRole'),
				edit: this.$store.hasPermission('UpdateRole'),
				del: this.$store.hasPermission('DeleteRole')
			}
		};
	},
	mounted() {
		this.handleSearch();
	},
	beforeRouteUpdate(to, from, next) {
		next();
		this.handleSearch();
	},
	methods: {
		async handleSearch() {
			this.loading = true;
			let res = await RoleAPI.Page(this.search);
			this.list = res.content || [];
			this.total = res.totalElements;

			let pageCount = Math.max(1, Math.ceil(this.total / this.search.limit));
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
		handleSelectable(row) {
			return !row.children || row.children.length === 0;
		},
		handleCreate() {
			this.$router.push({ name: 'CreateRole' });
		},
		handleUpdate(id) {
			this.$router.push({ name: 'UpdateRole', query: { id } });
		},
		async handleDelete(rows) {
			rows = rows || this.selection;
			if (rows.length === 0) {
				this.$message({
					showClose: true,
					message: '请至少选择一条要删除的数据',
					type: 'warning'
				});
			} else {
				try {
					await this.$confirm('确定要删除当前选择的数据吗？');
					let res = await RoleAPI.RemoveAll(rows);
					if (res) {
						this.$message({
							showClose: true,
							message: '删除成功',
							type: 'success'
						});
						this.handleSearch();
					} else {
						this.$message.error('删除失败');
					}
				} catch (e) {}
			}
		},
		handleSelectionChange(selection) {
			this.selection = selection.map(item => item.id);
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
<style lang="scss" scoped></style>
