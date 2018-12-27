<template>
	<Modal v-model="visiable" :mask-closable="false" scrollable footer-hide>
		<template slot="header">
			<Icon type="ios-paper"/>
			<span>查看角色</span>
		</template>
		<CellGroup>
			<Cell title="名称" label="name" :extra="form.name"/>
			<Cell title="代码" label="code" :extra="form.code"/>
			<Cell title="备注" label="description" :extra="form.description"/>
			<Cell title="创建者" label="creator" :extra="form.creatorUsername"/>
			<Cell title="创建时间" label="createDate" :extra="form.createDate"/>
			<Cell title="最后更新者" label="updator" :extra="form.updatorUsername"/>
			<Cell title="最后更新时间" label="updateDate" :extra="form.updateDate"/>
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
