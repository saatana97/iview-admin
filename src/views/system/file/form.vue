<template>
	<k-window
		:title="text[type]+'资源'"
		visible
		width="30%"
		:close-on-click-modal="false"
		:close-on-press-escape="false"
		@close="handleClose"
	>
		<el-form :rules="rule" ref="form" label-width="100px" :model="form" v-loading="loading">
			<el-form-item label="资源类型" prop="type">
				<el-autocomplete
					style="width:100%;"
					v-model="form.type"
					:fetch-suggestions="handleFilterType"
					placeholder="请输入或选择类型"
					:trigger-on-focus="true"
				></el-autocomplete>
			</el-form-item>
			<el-form-item label="文件名称" prop="label">
				<el-input v-model="form.label" clearable></el-input>
			</el-form-item>
			<el-form-item label="文件" prop="file">
				<el-upload
					drag
					:file-list="form.file"
					:on-success="handleUploadSuccess"
					:action="$store.baseURL+'resource/upload'"
				>
					<i class="el-icon-upload"></i>
					<div class="el-upload__text">
						将文件拖到此处，或
						<em>点击上传</em>
					</div>
					<div class="el-upload__tip" slot="tip">文件大小不能超过5MB</div>
				</el-upload>
			</el-form-item>
			<el-form-item label="备注" prop="description">
				<el-input type="textarea" :rows="5" v-model="form.description" clearable></el-input>
			</el-form-item>
		</el-form>
		<div slot="footer" class="dialog-footer">
			<el-button @click="handleClose">取 消</el-button>
			<el-button type="primary" :loading="loading" @click="handleSave">保 存</el-button>
		</div>
	</k-window>
</template>
<script>
import API from "@/api/resource";
import ObjectUtils from "@/utils/ObjectUtils";
import ArrayUtils from "@/utils/ArrayUtils";
export default {
	name: "ResourceForm",
	data() {
		const _this = this;
		return {
			loading: false,
			type: "create", //表单模式
			text: { create: "添加", update: "编辑" }, //表单模式对应文本
			form: {
				id: null,
				type: null,
				label: null,
				path: null,
				file: [],
				remark: null
			},
			old: {},
			opts: {
				type: []
			},
			rule: {
				type: [{ required: true, message: "资源类型不能为空" }],
				path: [{ required: true, message: "文件不能为空" }],
				label: [
					{ required: true, message: "文件名不能为空" },
					{
						async validator(rule, value, cb) {
							if (
								_this.form.type !== _this.old.type ||
								value !== _this.old.label
							) {
								let res = await API.Check({
									type: _this.form.type,
									label: value
								});
								if (res.length === 0) {
									cb();
								} else {
									cb("当前资源类型已存在相同的文件名");
								}
							} else {
								cb();
							}
						}
					}
				]
			}
		};
	},
	methods: {
		// 表单关闭
		handleClose() {
			this.$refs.form.resetFields();
			this.$router.push({ name: "ResourceManager" });
		},
		async handleLoadType() {
			let res = await API.List();
			this.opts.type = res.map(item => {
				return { value: item.type };
			});
		},
		handleUploadSuccess(res, file, list) {
			this.form.file = [file];
			if (res.status === 200) {
				this.form.path = res.data;
			} else {
				this.$message.error(res.message || "上传失败");
			}
		},
		//提交表单
		async handleSave() {
			try {
				await this.$refs.form.validate();
				this.loading = true;
				let Save = this.type === "create" ? API.Create : API.Update;
				let data = { ...this.form };
				delete data.file;
				let res = await Save(data);
				if (res) {
					this.$message({
						showClose: true,
						message: "保存成功",
						type: "success"
					});
					this.handleClose();
				} else {
					this.$message.error("保存失败");
				}
				this.loading = false;
			} catch (e) {
				console.info(e);
			}
		},
		handleFilterType(text, cb) {
			let res = this.opts.type;
			if (text) {
				res = res.filter(item => item.value.indexOf(text) !== -1);
			}
			cb(res);
		}
	},
	async mounted() {
		this.loading = true;
		await this.handleLoadType();
		let id = this.$route.query.id;
		if (id) {
			this.type = "update";
			let res = await API.Get(id);
			if (res) {
				ObjectUtils.Copy(res, this.form, true);
			} else {
				this.$message.error("无效的ID");
				this.handleClose();
			}
		}
		let type = this.$route.query.type;
		if (type) {
			this.form.type = type;
		}
		this.old = { ...this.form };
		this.loading = false;
	}
};
</script>
