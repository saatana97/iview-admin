<template>
	<div class="container flex-box row" v-loading="loading">
		<div class="right flex-box col">
			<div class="oparetion">
				<el-button v-if="permission.add" type="primary" @click="handleCreate">添加菜单</el-button>
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
					<el-table-column prop="title" label="菜单名称" show-overflow-tooltip></el-table-column>
					<el-table-column prop="data.router" label="链接" show-overflow-tooltip></el-table-column>
					<el-table-column prop="data.icon" label="图标" show-overflow-tooltip>
						<template slot-scope="scope">
							<i style="font-size:2em;" :class="scope.row.data.icon"></i>
						</template>
					</el-table-column>
					<el-table-column prop="data.display" label="是否显示" show-overflow-tooltip>
						<template slot-scope="scope">
							<span>{{scope.row.data.display?"是":"否"}}</span>
						</template>
					</el-table-column>
					<el-table-column prop="data.sort" label="排序" show-overflow-tooltip></el-table-column>
					<el-table-column prop="data.createDate" label="创建时间" width="150px"></el-table-column>
					<el-table-column
						label="操作"
						width="260px"
						v-if="permission.add || permission.del || permission.edit"
					>
						<template slot-scope="scope">
							<el-button
								v-if="permission.add"
								type="success"
								@click="handleChildren(scope.row.data.id)"
							>添加下级菜单</el-button>
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
import MenuAPI from "@/api/menu";
import TreeUtils from "@/utils/TreeUtils";
export default {
	name: "MenuManager",
	data() {
		return {
			loading: false,
			search: {},
			list: [],
			selection: [],
			currentMenu: null,
			opts: {
				menuType: ["菜单", "按钮"]
			},
			permission: {
				add: this.$store.hasPermission("CreateMenu"),
				edit: this.$store.hasPermission("UpdateMenu"),
				del: this.$store.hasPermission("DeleteMenu")
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
			this.list = await MenuAPI.Tree();
			// this.list = res.sort((prev, next) => prev.sort - next.sort);
			// this.list = TreeUtils.Build(
			// 	this.list,
			// 	"id",
			// 	"parentId",
			// 	"children"
			// );
			this.loading = false;
		},
		handleSelectable(row) {
			return !row.children || row.children.length === 0;
		},
		handleCreate() {
			this.$router.push({ name: "CreateMenu" });
		},
		handleUpdate(id) {
			this.$router.push({ name: "UpdateMenu", query: { id } });
		},
		handleChildren(id) {
			this.$router.push({ name: "CreateMenu", query: { parentId: id } });
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
					let res = await MenuAPI.RemoveAll(rows);
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
