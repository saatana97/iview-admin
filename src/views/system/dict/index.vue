<template>
	<div class="container flex-box row" v-loading="loading">
		<div class="right flex-box col">
			<div class="oparetion">
				<el-button v-if="permission.add" type="primary" @click="handleCreate">添加字典</el-button>
				<el-button v-if="permission.del" type="danger" @click="handleDelete()">批量删除</el-button>
			</div>
			<div class="search">
				<el-form ref="searchForm" :model="search" inline>
					<el-form-item label="字典类型" prop="type">
						<el-select v-model="search.type" clearable>
							<el-option value label="全部"></el-option>
							<el-option v-for="(item,index) in opts.type" :key="index" :value="item" :label="item"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="字典键" prop="label">
						<el-input v-model="search.label" clearable></el-input>
					</el-form-item>
					<el-form-item label="字典值" prop="value">
						<el-input v-model="search.value" clearable></el-input>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="handleSearch">搜索</el-button>
						<el-button type="success" @click="handleReset">重置</el-button>
					</el-form-item>
				</el-form>
			</div>
			<div class="content fill">
				<el-table :data="list" tooltip-effect="dark" @selection-change="handleSelectionChange">
					<el-table-column
						type="selection"
						width="55"
						v-if="permission.del"
						:selectable="handleSelectable"
					></el-table-column>
					<el-table-column type="index" label="序号" width="55" v-else></el-table-column>
					<el-table-column prop="type" label="字典类型" show-overflow-tooltip></el-table-column>
					<el-table-column prop="label" label="字典键" show-overflow-tooltip></el-table-column>
					<el-table-column prop="value" label="字典值" show-overflow-tooltip></el-table-column>
					<el-table-column prop="remark" label="备注" show-overflow-tooltip></el-table-column>
					<el-table-column
						label="操作"
						width="270px"
						v-if="permission.add || permission.del || permission.edit"
					>
						<template slot-scope="scope">
							<el-button v-if="permission.add" type="success" @click="handleChildren(scope.row.type)">添加键值</el-button>
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
import API from "@/api/dict";
import ArrayUtils from "@/utils/ArrayUtils";
export default {
	name: "DictionaryManager",
	data() {
		return {
			loading: false,
			search: {
				type: "",
				value: null,
				label: null,
				page: 1,
				limit: 10
			},
			total: 0,
			list: [],
			selection: [],
			opts: {
				type: []
			},
			permission: {
				add: this.$store.hasPermission("CreateDictionary"),
				edit: this.$store.hasPermission("UpdateDictionary"),
				del: this.$store.hasPermission("DeleteDictionary")
			}
		};
	},
	mounted() {
		this.handleLoadType();
		this.handleSearch();
	},
	beforeRouteUpdate(to, from, next) {
		next();
		this.handleSearch();
	},
	methods: {
		async handleLoadType() {
			let res = await API.List();
			this.opts.type = ArrayUtils.Unique(
				res.map(item => item.type)
			).sort();
		},
		async handleSearch() {
			this.loading = true;
			let res = await API.Page(this.search);
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
		async handleReset() {
			this.$refs.searchForm.resetFields();
			await this.handleSearch();
		},
		handleSelectable(row) {
			return !row.children || row.children.length === 0;
		},
		handleCreate() {
			this.$router.push({ name: "CreateDictionary" });
		},
		handleUpdate(id) {
			this.$router.push({ name: "UpdateDictionary", query: { id } });
		},
		handleChildren(type) {
			this.$router.push({
				name: "CreateDictionary",
				query: { type }
			});
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
					let res = await API.RemoveAll(rows);
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
