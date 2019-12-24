<template>
	<div class="xwk-icon-picker">
		<el-button-group>
			<el-button type="danger" @click="handlePick(null)">
				<slot name="clear">清除</slot>
			</el-button>
			<el-button type="primary" @click="handleShowDialog">
				<slot>选择</slot>
			</el-button>
		</el-button-group>
		<k-window append-to-body :visible="visible" :title="title" @close="handleClose">
			<div class="icon-picker-list">
				<el-button
					class="icon-picker-item"
					v-for="item in icons"
					:key="item"
					:icon="item.substring(1)"
					@click="handlePick(item.substring(1))"
				></el-button>
			</div>
		</k-window>
	</div>
</template>
<script>
import icons from "@/icons/icons";
export default {
	name: "IconPicker",
	props: {
		title: {
			type: String,
			default: "选择图标"
		}
	},
	data() {
		return {
			icons: icons.data,
			visible: false
		};
	},
	methods: {
		handleClose() {
			this.visible = false;
		},
		handlePick(icon) {
			this.$emit("pick", icon);
			this.handleClose();
		},
		handleShowDialog() {
			this.visible = true;
		}
	}
};
</script>

<style lang="scss" scoped>
.xwk-icon-picker {
	width: max-content;
	margin: 0;
	padding: 0;
}
.icon-picker-list {
	max-height: 500px;
	overflow: auto;
	.icon-picker-item {
		margin: 5px 10px;
		/deep/ i {
			transform: scale(2);
		}
	}
}
</style>
