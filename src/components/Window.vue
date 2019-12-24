<template>
	<el-dialog
		class="k-window"
		:visible.sync="dialogVisible"
		:append-to-body="appendToBody"
		:width="width"
		:close-on-click-modal="closeOnClickModal"
		:close-on-press-escape="closeOnPressEscape"
		@close="handleClose"
		ref="dialog"
	>
		<div class="content">
			<el-scrollbar>
				<slot></slot>
			</el-scrollbar>
		</div>
		<slot name="header" slot="title">
			<p class="el-dialog__title" @mousedown="handleMousedown" @mousemove="handleMousemove" @mouseup="handleMouseup" @mouseleave="moving = false">{{ title }}</p>
		</slot>
		<slot name="footer" slot="footer"></slot>
	</el-dialog>
</template>
<script>
export default {
	name: 'KWindow',
	props: {
		title: {
			type: String,
			default: '表单窗口'
		},
		width: {
			type: String,
			default: '30%'
		},
		visible: {
			type: Boolean,
			default: false
		},
		closeOnClickModal: {
			type: Boolean,
			default: false
		},
		closeOnPressEscape: {
			type: Boolean,
			default: false
		},
		appendToBody: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			x: 0,
			y: 0,
			left: 0,
			top: 0,
			dialog: null,
			moving: false,
			dialogVisible: false
		};
	},
	mounted() {
		this.init();
	},
	watch: {
		visible(value) {
			value && this.$nextTick(this.init);
			this.$emit('update:visible', value);
		},
		left(value) {
			value = Math.max(value, 0);
			value = Math.min(value, window.innerWidth - this.dialog.clientWidth);
			this.dialog.style.marginLeft = value + 'px';
		},
		top(value) {
			value = Math.max(value, 0);
			value = Math.min(value, window.innerHeight - this.dialog.clientHeight);
			this.dialog.style.marginTop = value + 'px';
		},
		dialogVisible(value) {
			this.$emit('update:visible', value);
		},
		visible(value) {
			this.dialogVisible = value;
		}
	},
	methods: {
		init() {
			this.dialogVisible = this.visible;
			this.dialog = this.$refs.dialog.$el.childNodes[0];
			this.left = (window.innerWidth - this.dialog.clientWidth) / 2;
			this.top = window.innerHeight * 0.15;
		},
		handleMousedown(e) {
			this.x = e.pageX;
			this.y = e.pageY;
			this.moving = true;
		},
		handleMouseup() {
			this.moving = false;
		},
		handleMousemove(e) {
			if (this.moving) {
				this.left -= (this.x - e.pageX) * 1.1;
				this.x = e.pageX;
				this.top -= (this.y - e.pageY) * 1.1;
				this.y = e.pageY;
			}
		},
		handleClose() {
			this.$emit('close');
		}
	}
};
</script>
<style lang="scss" scoped>
.k-window {
	/deep/ .el-dialog {
		margin: 0;
	}
	/deep/ .el-dialog__header {
		cursor: move;
		padding: 0;
		.el-dialog__title {
			margin: 0;
			padding: 20px 20px 10px;
		}
	}
	/deep/ .el-dialog__body {
		.content {
			height: 50vh;
			overflow: hidden;
		}
	}
}
</style>
