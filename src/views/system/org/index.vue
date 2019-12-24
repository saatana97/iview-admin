<template>
	<div class="container flex-box row" v-loading="loading">
		<div class="right flex-box col">
			<div class="oparetion">
				<el-button v-if="permission.add" type="primary" @click="handleCreate">添加组织机构</el-button>
				<el-button v-if="permission.del" type="danger" @click="handleDelete()">批量删除</el-button>
			</div>
			<div class="search"></div>
			<div class="content fill">
				<el-table
					row-key="code"
					:data="list"
					tooltip-effect="dark"
					@selection-change="handleSelectionChange"
				>
					<el-table-column
						type="selection"
						width="55"
						v-if="permission.del"
						:selectable="handleSelectable"
					></el-table-column>
					<el-table-column type="index" label="序号" width="55" v-else></el-table-column>
					<el-table-column prop="title" label="名称" show-overflow-tooltip></el-table-column>
					<el-table-column prop="data.code" label="代码" show-overflow-tooltip></el-table-column>
					<el-table-column prop="data.type" label="类型" show-overflow-tooltip>
						<template slot-scope="scope">{{opts.type[scope.row.data.type]}}</template>
					</el-table-column>
					<el-table-column prop="data.level" label="级别" show-overflow-tooltip>
						<template slot-scope="scope">{{opts.level[scope.row.data.level]}}</template>
					</el-table-column>
					<el-table-column prop="data.createDate" label="创建时间" width="150px"></el-table-column>
					<el-table-column
						label="操作"
						width="300px"
						v-if="permission.add || permission.del || permission.edit"
					>
						<template slot-scope="scope">
							<el-button
								v-if="permission.add"
								type="success"
								@click="handleChildren(scope.row.data.id)"
							>添加下级组织机构</el-button>
							<el-button v-if="permission.edit" type="primary" @click="handleUpdate(scope.row.data.id)">编辑</el-button>
							<el-button
								type="danger"
								@click="handleDelete([scope.row.data.id])"
								v-if="permission.del && (!scope.row.children || scope.row.children.length===0)"
							>删除</el-button>
						</template>
					</el-table-column>
				</el-table>
			</div>
		</div>
		<router-view />
	</div>
</template>
<script>
import API from "@/api/org";
import TreeUtils from "@/utils/TreeUtils";
export default {
	name: "OrgManager",
	data() {
		return {
			loading: false,
			search: {},
			list: [],
			selection: [],
			currentMenu: null,
			opts: {
				type: ["国家/地区", "组织机构"],
				level: [
					"大洲",
					"国家",
					"省",
					"市",
					"县区",
					"镇街",
					"村居",
					"组织机构"
				]
			},
			permission: {
				add: this.$store.hasPermission("CreateOrg"),
				edit: this.$store.hasPermission("UpdateOrg"),
				del: this.$store.hasPermission("DeleteOrg")
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
			this.list = await API.Tree();
			this.loading = false;
		},
		handleSelectable(row) {
			return !row.children || row.children.length === 0;
		},
		handleCreate() {
			this.$router.push({ name: "CreateOrg" });
		},
		handleUpdate(id) {
			this.$router.push({ name: "UpdateOrg", query: { id } });
		},
		handleChildren(id) {
			this.$router.push({ name: "CreateOrg", query: { parentId: id } });
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
					await this.$confirm("确定要删除当前选择的数据吗？");
					let res = await API.RemoveAll(rows);
					if (res) {
						this.$message({
							showClose: true,
							message: "删除成功",
							type: "success"
						});
						this.handleSearch();
					} else {
						this.$message.error("删除失败");
					}
				} catch (e) {}
			}
		},
		handleSelectionChange(selection) {
			this.selection = selection.map(item => {
				return item.code;
			});
		}
	}
};
</script>
<style lang="scss" scoped>
</style>
