<template>
	<Modal v-model="visiable" :mask-closable="false" scrollable footer-hide>
		<template slot="header">
			<Icon type="ios-paper"/>
			<span>查看字典</span>
		</template>
		<CellGroup>
			<Cell title="名称" label="type" :extra="form.type"/>
			<Cell title="代码" label="code" :extra="form.code"/>
			<Cell title="标签" label="label" :extra="form.label"/>
			<Cell title="值" label="value" :extra="form.value"/>
			<Cell title="排序" label="sort" :extra="form.sort+''"/>
			<Cell title="创建者" label="creator" :extra="form.creatorUsername"/>
			<Cell title="创建时间" label="createDate" :extra="form.createDate"/>
			<Cell title="最后更新者" label="updator" :extra="form.updatorUsername || '无'"/>
			<Cell title="最后更新时间" label="updateDate" :extra="form.updateDate || '无'"/>
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
