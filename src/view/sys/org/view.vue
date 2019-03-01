<template>
	<Modal v-model="visiable" :mask-closable="false" scrollable footer-hide>
		<template slot="header">
			<Icon type="ios-paper"/>
			<span>查看组织机构</span>
		</template>
		<CellGroup>
			<Cell title="名称" label="name" :extra="form.title"/>
			<Cell title="代码" label="code" :extra="form.code"/>
			<Cell title="类型" label="type" :extra="typeLabel"/>
			<Cell title="级别" label="level" :extra="levelLabel"/>
			<Cell title="上级组织机构" label="parent" :extra="form.parent.title"/>
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
import DictAPI from "@/api/dict";
export default {
	data() {
		return {
			visiable: false,
			form: { parent: {} },
			typeLabel: "",
			levelLabel: ""
		};
	},
	methods: {
		async show(row) {
			this.form = row;
			this.typeLabel = await DictAPi.Query({
				code: "orgType",
				value: this.form.type
			});
			this.levelLabel = await DictAPi.Query({
				code: "orgLevel",
				value: this.form.level
			});
			this.visiable = true;
		}
	}
};
</script>
