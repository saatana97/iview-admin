<template>
	<Modal v-model="visiable" :mask-closable="false" scrollable footer-hide>
		<template slot="header">
			<Icon type="ios-paper"/>
			<span>查看用户</span>
		</template>
		<CellGroup>
			<Cell title="姓名" label="name" :extra="form.name"/>
			<Cell title="年龄" label="age" :extra="form.age+''"/>
			<Cell title="性别" label="sex" :extra="sexText"/>
			<Cell title="地址" label="address" :extra="form.address"/>
			<Cell title="生日" label="birthday" :extra="form.birthday"/>
			<Cell title="创建者" label="creator" :extra="form.creatorUsername"/>
			<Cell title="创建时间" label="createDate" :extra="form.createDate"/>
			<Cell title="最后更新者" label="updator" :extra="form.updatorUsername"/>
			<Cell title="最后更新时间" label="updateDate" :extra="form.updateDate"/>
			<Cell title="最后登陆时间" label="loginDate" :extra="form.authorizer.loginDate"/>
			<Input
				v-model="form.description"
				type="textarea"
				readonly
				:autosize="{minRows: 2,maxRows: 5}"
				placeholder="暂无备注信息"
			/>
		</CellGroup>
	</Modal>
</template>
<script>
import API from "@/api/dict";
export default {
	data() {
		return {
			visiable: false,
			sexText: "",
			form: { authorizer: {} }
		};
	},
	methods: {
		async show(row) {
			this.form = row;
			this.sexText = await API.Query({
				code: "sex",
				value: row.sex || ""
			});
			this.visiable = true;
		}
	}
};
</script>
