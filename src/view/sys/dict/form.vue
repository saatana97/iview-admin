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
			<span>添加字典</span>
		</template>
		<template slot="header" v-else>
			<Icon type="ios-create"/>
			<span>编辑字典</span>
		</template>
		<Form :model="form" :rules="rules" :label-width="80" ref="form">
			<FormItem label="类型" prop="type">
				<AutoComplete
					v-model="form.type"
					:data="types"
					@on-search="handleTypeComplete"
					placeholder="请输入字典类型"
				></AutoComplete>
			</FormItem>
			<FormItem label="代码" prop="code">
				<AutoComplete
					v-model="form.code"
					:data="codes"
					@on-search="handleCodeComplete"
					placeholder="请输入字典代码"
				></AutoComplete>
			</FormItem>
			<FormItem label="标签" prop="label">
				<Input v-model="form.label" clearable placeholder="请输入字典标签"></Input>
			</FormItem>
			<FormItem label="值" prop="value">
				<InputNumber v-model="form.value" :max="999" :min="0" style="width:100%;"></InputNumber>
			</FormItem>
			<FormItem label="排序" prop="sort">
				<InputNumber v-model="form.sort" :max="999" :min="0" style="width:100%;"></InputNumber>
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
import API from "@/api/dict";
import ArrayUtils from "@/scripts/ArrayUtils";
export default {
	data() {
		const _this = this;
		return {
			visiable: false,
			loading: false,
			type: "create",
			types: [],
			codes: [],
			form: { value: 0, sort: 0 },
			_form: "",
			rules: {
				code: [
					{
						required: true,
						message: "字典代码不能为空",
						trigger: "change"
					}
				],
				label: [
					{
						required: true,
						message: "字典标签不能为空",
						trigger: "change"
					},
					{
						async validator(rule, value, cb) {
							let old = JSON.parse(_this._form);
							if (
								old.code === _this.form.code &&
								old.label === value
							) {
								cb();
							} else {
								let res = await API.Check({
									code: _this.form.code,
									label: _this.form.label
								});
								if (res.length === 0) {
									cb();
								} else {
									cb(new Error("字典标签已存在"));
								}
							}
						},
						trigger: "blur"
					}
				],
				value: [
					{
						required: true,
						message: "字典值不能为空",
						trigger: "change"
					},
					{
						async validator(rule, value, cb) {
							let old = JSON.parse(_this._form);
							if (
								old.code === _this.form.code &&
								old.value === value
							) {
								cb();
							} else {
								let res = await API.Check({
									code: _this.form.code,
									value: _this.form.value
								});
								if (res.length === 0) {
									cb();
								} else {
									cb(new Error("字典值已存在"));
								}
							}
						},
						trigger: "blur"
					}
				]
			}
		};
	},
	methods: {
		async show(row, type) {
			this.visiable = true;
			this.form = row ? JSON.parse(JSON.stringify(row)) : this.form;
			this._form = JSON.stringify(this.form);
			this.type = type || "create";
		},
		handleSave() {
			const _this = this;
			this.$refs.form.validate(async res => {
				this.loading = true;
				if (res) {
					let Save = _this.form.id ? API.Update : API.Create;
					await Save(_this.form);
					this.$emit("save", _this.form);
					_this.visiable = false;
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
		},
		async handleTypeComplete(type) {
			let res = await API.List({ type });
			this.types = ArrayUtils.Unique(res).map(item => {
				return item.type;
			});
		},
		async handleCodeComplete(code) {
			let res = await API.List({ code });
			this.codes = ArrayUtils.Unique(res).map(item => {
				return item.code;
			});
		}
	},
	watch: {
		async "form.code"(value, old) {
			if (this.type === "create") {
				let res = await API.Check({ code: value });
				let count = res.length;
				this.form.sort = (count + 1) * 10;
				this.form.value = count + 1;
			}
		}
	}
};
</script>
<style lang="scss" scoped>
* {
	/deep/ .ivu-input-number-input-wrap {
		width: calc(100% - 22px);
	}
}
</style>
