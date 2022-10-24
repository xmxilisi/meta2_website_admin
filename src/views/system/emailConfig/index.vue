<template>
  <div class="app-container">
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['system:emailConfig:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:emailConfig:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:emailConfig:remove']"
        >删除</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="emailConfigList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="主键" align="center" prop="emailConfigId" v-if="true"/>
      <el-table-column label="名称" align="center" prop="configKey" />
      <el-table-column label="服务器类型" align="center" prop="serverType" />
      <el-table-column label="服务器地址" align="center" prop="sendHttps" />
      <el-table-column label="SSL端口号" align="center" prop="sslport" />
      <el-table-column label="邮箱账号" align="center" prop="account" />
      <el-table-column label="密码 / 授权码" align="center" prop="password" />
      <el-table-column label="发送签名" align="center" prop="remark" />
      <el-table-column label="状态" align="center" prop="status" >
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sys_normal_disable" :value="scope.row.status"/>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleTest(scope.row)"
            v-hasPermi="['system:emailConfig:test']"
          >测试</el-button>

          <el-button
            size="mini"
            type="text"
            icon="el-icon-circle-close"
            @click="handleClose(scope.row)"
            v-hasPermi="['system:emailConfig:close']"
          >
            <span v-if="scope.row.status === '0'">禁用</span><span v-else>启用</span>
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:emailConfig:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:emailConfig:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改邮箱配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="配置key" prop="configKey">
          <el-input v-model="form.configKey" placeholder="请输入配置key" />
        </el-form-item>
        <el-form-item label="服务器类型">
          <el-select v-model="form.serverType" placeholder="请输入服务器类型">
            <el-option label="POP3" value="pop3"></el-option>
            <el-option label="SMTP" value="smtp"></el-option>
            <el-option label="SMTPS" value="smtps"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="服务器地址" prop="sendHttps">
          <el-input v-model="form.sendHttps" placeholder="请输入发送服务器地址" />
        </el-form-item>
        <el-form-item label="SSL 端口号" prop="sslport">
          <el-input v-model="form.sslport" placeholder="请输入SSL 端口号" />
        </el-form-item>
        <el-form-item label="邮箱账号" prop="account">
          <el-input v-model="form.account" placeholder="请输入邮箱账号" />
        </el-form-item>
        <el-form-item label="密码 / 授权码" prop="password">
          <el-input type="password" v-model="form.password" placeholder="请输入密码 / 授权码" />
        </el-form-item>
        <el-form-item label="发送签名" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio label="0">正常</el-radio>
            <el-radio label="1">停用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :loading="buttonLoading" type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listEmailConfig,
  getEmailConfig,
  delEmailConfig,
  addEmailConfig,
  updateEmailConfig,
  changeStatus, testEmailConfig
} from "@/api/system/emailConfig";
import {changeUserStatus, delUser} from "@/api/system/user";
import {resetUserPwd} from "@/api/member/member";

export default {
  name: "EmailConfig",
  dicts: ['sys_normal_disable'],
  data() {
    return {
      // 按钮loading
      buttonLoading: false,
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 邮箱配置表格数据
      emailConfigList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        emailConfigId: undefined,
        configKey: undefined,
        serverType: undefined,
        sendHttps: undefined,
        sslport: undefined,
        account: undefined,
        password: undefined,
        remark: undefined,
        status: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        configKey: [
          { required: true, message: '请输入配置key', trigger: 'blur' },
        ],
        account: [
          { required: true, message: '请输入邮箱账号', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询邮箱配置列表 */
    getList() {
      this.loading = true;
      listEmailConfig(this.queryParams).then(response => {
        this.emailConfigList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        emailConfigId: undefined,
        configKey: undefined,
        serverType: undefined,
        sendHttps: undefined,
        sslport: undefined,
        account: undefined,
        password: undefined,
        remark: undefined,
        status: "0",
        createBy: undefined,
        createTime: undefined,
        updateBy: undefined,
        updateTime: undefined
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.emailConfigId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加邮箱配置";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.loading = true;
      this.reset();
      const emailConfigId = row.emailConfigId || this.ids
      getEmailConfig(emailConfigId).then(response => {
        this.loading = false;
        this.form = response.data;
        this.open = true;
        this.title = "修改邮箱配置";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.buttonLoading = true;
          if (this.form.emailConfigId != null) {
            updateEmailConfig(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            }).finally(() => {
              this.buttonLoading = false;
            });
          } else {
            addEmailConfig(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            }).finally(() => {
              this.buttonLoading = false;
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const emailConfigIds = row.emailConfigId || this.ids;
      this.$modal.confirm('是否确认删除邮箱配置编号为"' + emailConfigIds + '"的数据项？').then(() => {
        this.loading = true;
        return delEmailConfig(emailConfigIds);
      }).then(() => {
        this.loading = false;
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).finally(() => {
        this.loading = false;
      });
    },
    /** 发送邮件测试 */
    handleTest(row) {
      this.$prompt('请输入接收测试的邮箱账号', "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        closeOnClickModal: false,
        inputPattern: /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
        inputErrorMessage: "邮箱格式不正确",
      }).then(({ value }) => {
        testEmailConfig(row, value).then(response => {
          this.$modal.msgSuccess("发送成功");
        });
      }).catch(() => {});
    },
    // 状态修改
    handleClose(row) {
      let text = row.status === "0" ? "停用" : "启用";
      const emailConfigIds = row.emailConfigId || this.ids;
      this.$modal.confirm('确认要"' + text + '"吗？').then(function() {
        const status = row.status === "0" ? "1" : "0";
        return changeStatus(emailConfigIds, status);

      }).then(() =>{

        this.$modal.msgSuccess(text + "成功");
        this.getList();
      }).catch(function() {
        row.status = row.status === "0" ? "0" : "1";
      });
    }
  }
};
</script>
