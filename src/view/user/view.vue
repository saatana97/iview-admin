<template>
	<Modal v-model="visiable" :mask-closable="false" scrollable footer-hide>
		<template slot="header">
			<Icon type="ios-paper"/>
			<span>查看用户</span>
		</template>
		<CellGroup>
			<Cell title="姓名" label="name" :extra="form.name"/>
			<Cell title="年龄" label="age" :extra="form.age+''"/>
			<Cell title="地址" label="address" :extra="form.address"/>
			<Cell title="创建者" label="creator" :extra="form.creator"/>
			<Cell title="创建时间" label="createDate" :extra="form.createDate"/>
			<Cell title="最后更新者" label="updator" :extra="form.updator"/>
			<Cell title="最后更新时间" label="updateDate" :extra="form.updateDate"/>
			<Cell title="最后登陆时间" label="loginDate" :extra="form.loginDate"/>
		</CellGroup>
	</Modal>
</template>
<script>
export default {
	data() {
		return {
			visiable: false,
			form: {}
		};
	},
	methods: {
		show(row) {
			this.form = row;
			this.visiable = true;
		}
	}
};
</script>
