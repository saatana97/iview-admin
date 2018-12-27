<template>
	<Modal
		v-model="visiable"
		:mask-closable="false"
		:closable="false"
		scrollable
		@on-visible-change="handleVisiableChange"
	>
		<template slot="header" v-if="type === 'create'">
			<Icon type="md-add-circle"/>
			<span>添加用户</span>
		</template>
		<template slot="header" v-else>
			<Icon type="ios-create"/>
			<span>编辑用户</span>
		</template>
		<Form :model="form" :rules="rules" :label-width="80" ref="form">
			<FormItem label="姓名" prop="name">
				<Input v-model="form.name" clearable placeholder="Enter something..."></Input>
			</FormItem>
			<FormItem label="备注" prop="description">
				<Input
					v-model="form.description"
					type="textarea"
					:autosize="{minRows: 2,maxRows: 5}"
					:maxlength="255"
					placeholder="请输入备注信息"
				></Input>
			</FormItem>
		</Form>
		<template slot="footer">
			<Button type="primary" ghost size="large" @click="handleCancel">取消</Button>
			<Button type="primary" size="large" :loading="loading" @click="handleSave">保存</Button>
		</template>
	</Modal>
</template>
<script>
export default {
	data() {
		return {
			visiable: false,
			loading: false,
			type: "create",
			form: {},
			_form: "",
			rules: {
				name: [
					{
						required: true,
						message: "用户名不能为空",
						trigger: "change"
					}
				]
			}
		};
	},
	methods: {
		show(row, type) {
			this.visiable = true;
			this.form = row ? JSON.parse(JSON.stringify(row)) : {};
			this._form = JSON.stringify(this.form);
			this.type = type || "create";
		},
		handleSave() {
			const _this = this;
			this.$refs.form.validate(res => {
				this.loading = true;
				if (res) {
					this.visiable = false;
				} else {
					setTimeout(() => {
						_this.loading = false;
					}, 1000);
				}
			});
		},
		handleVisiableChange(visiable) {
			if (!visiable) {
				this.loading = false;
				this.$refs.form.resetFields();
			}
		},
		handleCancel() {
			if (JSON.stringify(this.form) === this._form) {
				this.visiable = false;
			} else {
				this.$Modal.confirm({
					title: "操作提示",
					content: "当前数据未保存，确定要关闭本窗口吗？",
					closable: true,
					onOk: () => {
						this.visiable = false;
					}
				});
			}
		}
	}
};
</script>
