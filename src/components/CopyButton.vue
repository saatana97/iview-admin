<template>
	<el-button class="copy-btn" :data-clipboard-text="data" @click="handleCopy">
		<slot>复制</slot>
	</el-button>
</template>

<script>
import ClipboardJS from 'clipboard';
var clipboard = new ClipboardJS('.copy-btn');
clipboard.on('success', e => {
	console.info('[copy]', e.text);
});
export default {
	name: 'CopyButton',
	props: {
		data: {
			type: String,
			default: 'Nothing to copy'
		}
	},
	data() {
		return {};
	},
	mounted() {},
	methods: {
		handleCopy() {
			this.$message.success('复制成功');
		}
	}
};
</script>

<style lang="scss" scoped></style>
