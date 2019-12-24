<template>
	<div id="app">
		<router-view />
	</div>
</template>
<script>
export default {
	name: 'App'
};
</script>

<style lang="scss">
*:not([class^='el-']) {
	padding: 0;
	margin: 0;
	position: relative;
}
html {
	width: 100vw;
	height: 100vh;
	body {
		width: 100%;
		height: 100%;
		padding: 0;
		margin: 0;
		#app {
			width: 100%;
			height: 100%;
			overflow: hidden;
			background: #f2f6fc;
			.text-success {
				color: #67c23a;
			}
			.text-info {
				color: #909399;
			}
			.text-primary {
				color: #409eff !important;
			}
			.text-warning {
				color: #e6a23c;
			}
			.text-danger {
				color: #f56c6c;
			}
			.flex-box {
				display: flex;
				.fill {
					flex-grow: 1;
				}
				.half {
					flex-grow: 0.5;
				}
				&.fill {
					width: 100%;
					height: 100%;
				}
				&.row-fill {
					width: 100%;
				}
				&.col-fill {
					height: 100%;
				}
				&.row {
					flex-direction: row;
				}
				&.col {
					flex-direction: column;
				}
				&.row-center {
					justify-content: center;
				}
				&.row-start {
					justify-content: flex-start;
				}
				&.row-end {
					justify-content: flex-end;
				}
				&.row-base {
					justify-content: baseline;
				}
				&.row-around {
					justify-content: space-around;
				}
				&.row-between {
					justify-content: space-between;
				}
				&.col-center {
					align-items: center;
				}
				&.col-start {
					align-items: flex-start;
				}
				&.col-end {
					align-items: flex-end;
				}
				&.col-base {
					align-items: baseline;
				}
			}
			a {
				text-decoration: none;
				&:visited {
					color: inherit;
				}
			}
			ul {
				list-style: none;
			}
		}
		//   修复输入框追加内容内的按钮样式被覆盖的问题
		.el-input-group__append {
			.el-button:nth-of-type(1) {
				border-top-left-radius: 0;
				border-bottom-left-radius: 0;
			}
			.el-button--primary {
				top: -2px;
				background-color: #409eff;
				border-color: #409eff;
				border: 1px solid #409eff;
				color: white;
				&.is-disabled {
					background-color: #a0cfff;
					border-color: #a0cfff;
				}
			}
			.el-button--danger {
				top: -2px;
				background-color: #f56c6c;
				border-color: #f56c6c;
				border: 1px solid #f56c6c;
				color: white;
				&.is-disabled {
					background-color: #fab6b6;
					border-color: #fab6b6;
				}
			}
		}
		//   覆盖卡片圆角弧度
		.el-card {
			border-radius: 30px;
		}
		// 覆盖表格body内容溢出
		.el-table {
			.el-table__body-wrapper {
				height: calc(100% - 37px) !important;
				overflow: hidden auto;
			}
		}
		// 覆盖滚动条样式
		.el-scrollbar {
			width: 100%;
			height: 100%;
			/deep/ .el-scrollbar__wrap {
				overflow-x: hidden;
				.el-scrollbar__view {
					width: 100%;
					height: 100%;
				}
			}
		}
	}
}
</style>
