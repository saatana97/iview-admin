<template>
	<Modal v-model="visiable" :mask-closable="false" scrollable footer-hide>
		<template slot="header">
			<Icon type="ios-paper"/>
			<span>查看菜单</span>
		</template>
		<CellGroup>
			<Cell title="名称" label="title" :extra="form.title"/>
			<Cell title="代码" label="code" :extra="form.code"/>
			<Cell title="路由" label="router" :extra="form.router" :to="'/#'+form.router" target="_blank"/>
			<Cell title="图标" :label="form.icon">
				<template slot="extra">
					<Icon :type="form.icon"/>
				</template>
			</Cell>
			<Cell title="权限" label="permission" :extra="form.permission"/>
			<Cell title="状态" label="display" :extra="form.show?'显示':'隐藏'"/>
			<Cell title="创建者" label="creator" :extra="form.creatorUsername"/>
			<Cell title="创建时间" label="createDate" :extra="form.createDate"/>
			<Cell title="最后更新者" label="updator" :extra="form.updatorUsername"/>
			<Cell title="最后更新时间" label="updateDate" :extra="form.updateDate"/>
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
