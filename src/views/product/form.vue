<template>
	<k-window :title="text[type] + '商品'" visible width="30%" :close-on-click-modal="false" :close-on-press-escape="false" @close="handleClose">
		<el-form :rules="rule" ref="form" label-width="100px" :model="form" v-loading="loading">
			<el-form-item label="商品名称" prop="name">
				<el-input v-model="form.name" clearable></el-input>
			</el-form-item>
			<el-form-item label="进价" prop="money">
				<el-input-number v-model="form.money" clearable :min="0.5" :max="9999" :step="0.5"></el-input-number>
			</el-form-item>
			<el-form-item label="售价" prop="price">
				<el-input-number v-model="form.price" clearable :min="0.5" :max="9999" :step="0.5"></el-input-number>
			</el-form-item>
			<el-form-item label="库存" prop="count">
				<el-input-number v-model="form.count" clearable :min="0" :max="9999" :step="10"></el-input-number>
			</el-form-item>
			<el-form-item label="备注" prop="description">
				<el-input type="textarea" v-model="form.description" clearable></el-input>
			</el-form-item>
		</el-form>
		<div slot="footer" class="dialog-footer">
			<el-button @click="handleClose">取 消</el-button>
			<el-button type="primary" :loading="loading" @click="handleSave">保 存</el-button>
		</div>
	</k-window>
</template>
<script>
import API from '@/api/role';
import ObjectUtils from '@/utils/ObjectUtils';

export default {
	name: 'ProductForm',
	data() {
		const _this = this;
		return {
			loading: false,
			type: 'create', //表单模式
			text: { create: '添加', update: '编辑' }, //表单模式对应文本
			form: {
				id: null,
				name: null,
				money: 0,
				price: 0,
				count: 0,
				remark: null
			},
			old: {},
			rule: {
				name: [
					{ required: true, message: '商品名称不能为空' },
					{
						async validator(rule, value, cb) {
							if (value === _this.old.name) {
								cb();
							} else {
								let res = await API.Check({
									name: value
								});
								if (res.length === 0) {
									cb();
								} else {
									cb('商品名称不能重复');
								}
							}
						}
					}
				]
			}
		};
	},
	async mounted() {
		this.loading = true;
		let id = this.$route.query.id;
		if (id) {
			this.type = 'update';
			let res = await API.Get(id);
			if (res) {
				ObjectUtils.Copy(res, this.form, true);
			} else {
				this.$message.error('无效的ID');
				this.handleClose();
			}
		}
		this.old = { ...this.form };
		this.loading = false;
	},
	methods: {
		// 表单关闭
		handleClose() {
			this.$refs.form.resetFields();
			this.$router.push({ name: 'ProductManager' });
		},
		//提交表单
		async handleSave() {
			try {
				await this.$refs.form.validate();
				const _this = this;
				this.loading = true;
				let Save = this.type === 'create' ? API.Create : API.Update;
				let res = await Save(this.form);
				if (res) {
					this.$message({
						showClose: true,
						message: '保存成功',
						type: 'success'
					});
					this.handleClose();
				} else {
					this.$message.error('保存失败');
				}
				this.loading = false;
			} catch (e) {
				console.info(e);
			}
		}
	}
};
</script>
