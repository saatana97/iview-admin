<template>
	<Modal
		v-model="visiable"
		:width="454"
		:mask-closable="false"
		@on-visible-change="handleVisiableChange"
	>
		<template slot="header">
			<Icon type="ios-list-box"/>
			<span>分配用户</span>
		</template>
		<Input
			v-model="filterName"
			clearable
			placeholder="请输入要筛选的用户名"
			suffix="ios-search"
			style="margin-bottom:10px;"
		></Input>
		<Transfer
			:data="handleFilter()"
			:target-keys="targetKeys"
			:titles="['未分配用户','已分配用户']"
			@on-change="handleTransfer"
		></Transfer>
		<template slot="footer">
			<Button type="primary" ghost size="large" @click="handleCancel">取消</Button>
			<Button type="primary" size="large" :loading="loading" @click="handleSave">保存</Button>
		</template>
	</Modal>
</template>
<script>
import AuthApi from "@/api/auth";
import RoleApi from "@/api/role";
export default {
	data() {
		return {
			visiable: false,
			loading: false,
			role: {},
			auths: [],
			dispatchs: [],
			targetKeys: [],
			filterName: null,
			olds: []
		};
	},
	methods: {
		async show(row) {
			this.role = row;
			const _this = this;
			this.auths = [];
			this.dispatchs = [];
			this.targetKeys = [];
			this.olds = [];
			(await AuthApi.List({})).forEach(auth => {
				_this.auths.push({
					key: auth.id,
					label: auth.username,
					description: auth.description,
					disabled: false,
					roles: auth.roles
				});
			});
			this.auths.forEach(item => {
				let roleIds = item.roles.map(role => {
					return role.id;
				});
				if (roleIds.indexOf(_this.role.id) !== -1) {
					this.olds.push(_this.role.id);
				}
			});
			this.dispatchs = this.targetKeys = [...this.olds];
			this.visiable = true;
		},
		handleFilter() {
			let res = [];
			if (this.filterName) {
				this.auths.forEach(item => {
					if (item.label.indexOf(this.filterName) !== -1) {
						res.push(item);
					}
				});
			} else {
				res = this.auths;
			}
			return res;
		},
		async handleSave() {
			this.loading = true;
			const _this = this;
			let oldIds = this.olds.map(item => {
				return item.key;
			});
			let undispatchs = this.olds
				.filter(item => {
					return _this.dispatchs.indexOf(item.key) === -1;
				})
				.map(item => {
					return item.key;
				});
			this.dispatchs = this.dispatchs.filter(item => {
				return oldIds.indexOf(item) === -1;
			});
			if (this.dispatchs.length > 0) {
				await RoleApi.Dispatch(this.role.id, this.dispatchs);
			}
			if (undispatchs.length > 0) {
				await RoleApi.Undispatch(this.role.id, undispatchs);
			}
			this.visiable = false;
		},
		handleTransfer(targetKeys, direction, moveKeys) {
			console.log(targetKeys.join(",") || "无");
			this.dispatchs = this.targetKeys = targetKeys;
		},
		handleCancel() {
			if (this.targetKeys.join(",") === this.olds.join(",")) {
				this.visiable = false;
			} else {
				this.$Modal.confirm({
					title: "操作提示",
					content: "当前数据未保存，确定要关闭本窗口吗？",
					closable: true,
					onOk: () => {
						this.visiable = false;
					}
				});
			}
		},
		handleVisiableChange(visiable) {
			if (!visiable) {
				this.loading = false;
			}
		}
	}
};
</script>
