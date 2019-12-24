<template>
	<div class="xwk-resource-picker">
		<el-button-group>
			<el-button type="danger" @click="handlePick(null)">
				<slot name="clear">清除</slot>
			</el-button>
			<el-button type="primary" @click="handleShow">
				<slot>选择</slot>
			</el-button>
		</el-button-group>
		<k-window append-to-body :visible="visible" title="选择资源" width="50%" @close="handleClose">
			<el-input v-model="search" clearable placeholder="请输入资源名称进行筛选"></el-input>
			<div class="picker-list">
				<el-button class="picker-item" v-for="(item, index) in visibleList" :key="index" @click="handlePick(item)">
					<p>{{ item.label }}</p>
					<img :src="`/api/resource/download/${item.id}`" :alt="item.label" />
				</el-button>
			</div>
		</k-window>
	</div>
</template>

<script>
import API from '@/api/resource';
export default {
	name: 'ResourcePicker',
	data() {
		return {
			visible: false,
			search: null,
			list: []
		};
	},
	computed: {
		visibleList() {
			let res = this.list;
			if (this.search) {
				res = res.filter(item => item.label.toLowerCase().indexOf(this.search.toLowerCase()) !== -1);
			}
			return res;
		}
	},
	async mounted() {
		this.list = await API.List({});
	},
	methods: {
		handleShow() {
			this.visible = true;
		},
		handleClose() {
			this.visible = false;
		},
		handlePick(resource) {
			this.handleClose();
			this.$emit('pick', resource);
		}
	}
};
</script>

<style lang="scss" scoped>
.xwk-resource-picker {
	width: max-content;
	margin: 0;
	padding: 0;
}
.el-input {
	margin-bottom: 20px;
}
.picker-list {
	height: 100%;
	display: flex;
	flex-wrap: wrap;
	.picker-item {
		width: 33%;
		height: max-content;
		/deep/ img {
			width: 100%;
		}
	}
}
</style>
