<template>
  <div style="margin:30px;">
    <el-form ref="settingsForm" :model="formData" :rules="rules" size="medium" label-width="150px"
      label-position="left">
      <el-form-item label="站点名称" prop="site_name">
        <el-input v-model="formData.site_name" placeholder="请输入站点名称" :maxlength="11" show-word-limit clearable
          :style="{width: '100%'}">
          <template slot="append">站点的名称</template>
        </el-input>
      </el-form-item>
      <el-form-item label="首页标题" prop="site_title">
        <el-input v-model="formData.site_title" placeholder="请输入首页标题" clearable :style="{width: '100%'}">
          <template slot="append">站点的首页标题</template>
        </el-input>
      </el-form-item>
      <el-form-item label="站点介绍" prop="site_introduction">
        <el-input v-model="formData.site_introduction" type="textarea" placeholder="请输入站点介绍" :maxlength="60"
          show-word-limit :autosize="{minRows: 4, maxRows: 4}" :style="{width: '100%'}"></el-input>
      </el-form-item>
      <el-form-item label="站点LOGO" prop="logo" required>
          <imageUpload v-model="formData.logo" fileSize="2" />
      </el-form-item>
      <el-form-item label="注册密码最小长度" prop="password_length">
        <el-input-number v-model="formData.password_length" placeholder="注册密码最小长度" controls-position=right>
        </el-input-number>
      </el-form-item>
      <el-form-item label="新用户注册" prop="register_close" required>
        <el-switch v-model="formData.register_close" active-value="1" inactive-value="0"></el-switch>
      </el-form-item>
      <el-form-item label="新用户审核" prop="register_validate" required>
        <el-switch v-model="formData.register_validate" active-value="1" inactive-value="0"></el-switch>
      </el-form-item>
      <el-form-item label="支持的文件扩展名" prop="support_file_ext">
        <el-input v-model="formData.support_file_ext" placeholder="请输入支持的文件扩展名" clearable
          :style="{width: '100%'}">
          <template slot="append">多个请用,隔开，例如 doc,docx,pdf,zip</template>
        </el-input>
      </el-form-item>
      <el-form-item label="支持的图片扩展名" prop="support_img_ext">
        <el-input v-model="formData.support_img_ext" placeholder="请输入支持的图片扩展名" clearable
          :style="{width: '100%'}">
          <template slot="append">多个请用,隔开，例如 png,gif,jpg,jpeg,heic</template>
        </el-input>
      </el-form-item>
      <el-form-item label="支持的最大尺寸" prop="support_max_size">
        <el-input-number v-model="formData.support_max_size" placeholder="支持的最大尺寸" controls-position=right>
        </el-input-number>
      </el-form-item>
      <el-form-item size="large">
        <el-button :loading="buttonLoading" type="primary" @click="submitForm">提交</el-button>
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { listSettings, getSettings, delSettings, addSettings, updateSettings } from "@/api/community/settings";

export default {
  components: {},
  props: [],
  data() {
    return {
      formData: {
        site_name: undefined,
        site_title: undefined,
        site_introduction: undefined,
        logo: undefined,
        password_length: undefined,
        register_close: undefined,
        register_validate: undefined,
        support_file_ext: undefined,
        support_img_ext: undefined,
        support_max_size: undefined,
      },
      rules: {
        site_name: [{
          required: true,
          message: '请输入站点名称',
          trigger: 'blur'
        }],
        site_title: [{
          required: true,
          message: '请输入首页标题',
          trigger: 'blur'
        }],
        site_introduction: [{
          required: true,
          message: '请输入站点介绍',
          trigger: 'blur'
        }],
        password_length: [{
          required: true,
          message: '注册密码最小长度',
          trigger: 'blur'
        }],
        support_file_ext: [{
          required: true,
          message: '请输入支持的文件扩展名',
          trigger: 'blur'
        }],
        support_img_ext: [{
          required: true,
          message: '请输入支持的图片扩展名',
          trigger: 'blur'
        }],
        support_max_size: [{
          required: true,
          message: '支持的最大尺寸',
          trigger: 'blur'
        }],
      },
    }
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询站点设置列表 */
    getList() {
      this.loading = true;
      listSettings(this.queryParams).then(response => {
        for (let i = 0; i < response.rows.length; i++) {
          this.formData[response.rows[i].k] = response.rows[i].v;
        }
        console.log(this.formData);
        this.loading = false;
      });
    },
    submitForm() {
      this.$refs['settingsForm'].validate(valid => {
        if (valid){
          this.buttonLoading = true;
          if (this.formData != null) {
            updateSettings(this.formData).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            }).finally(() => {
              this.buttonLoading = false;
            });
          }
        }
      })
    },
    resetForm() {
      this.$refs['settingsForm'].resetFields()
    },
  }
}

</script>
<style>
.el-upload__tip {
  line-height: 1.2;
}

</style>
