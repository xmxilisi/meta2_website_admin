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
          v-hasPermi="['community:notificationTpls:add']"
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
          v-hasPermi="['community:notificationTpls:edit']"
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
          v-hasPermi="['community:notificationTpls:remove']"
        >删除</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="notificationTplsList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="id" align="center" prop="id" v-if="true"/>
      <el-table-column label="标识ID" align="center" prop="noticeId" />
      <el-table-column label="通知方式" align="center" prop="type" >
        <template slot-scope="scope">
          <dict-tag :options="dict.type.notificationTpls_type" :value="scope.row.type"/>
        </template>
      </el-table-column>
      <el-table-column label="通知类型" align="center" prop="typeName" />
      <el-table-column label="状态" align="center" prop="status" >
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            active-value="1"
            inactive-value="0"
            @change="handleStatus(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['community:notificationTpls:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['community:notificationTpls:remove']"
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

    <!-- 添加或修改系统通知模板对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="1200px" append-to-body :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="模板唯一标识ID" prop="noticeId">
          <el-input v-model="form.noticeId" placeholder="请输入模板唯一标识ID" />
        </el-form-item>
        <el-form-item label="通知方式" prop="type">
          <el-select v-model="form.type" placeholder="请选择通知方式">
            <el-option
              v-for="dict in dict.type.notificationTpls_type"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="类型名称" prop="typeName">
          <el-input v-model="form.typeName" placeholder="请输入类型名称" />
        </el-form-item>
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入标题" />
        </el-form-item>
        <el-form-item label="内容">
          <editor v-model="form.content" :min-height="192"/>
        </el-form-item>
        <el-form-item label="可选的变量" prop="vars">
          <el-input v-model="form.vars" placeholder="请输入可选的变量" />
        </el-form-item>
        <el-form-item label="跳转地址" prop="redirectUrl">
          <el-input v-model="form.redirectUrl" placeholder="请输入跳转地址" />
        </el-form-item>
        <el-form-item label="发送状态" prop="isError">
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="top-start" width="200" content="form.errorMsg">
              <div slot="reference" class="name-wrapper">
                <dict-tag :options="dict.type.sys_common_status" :value="form.isError"/>
              </div>
            </el-popover>
          </template>
        </el-form-item>
        <el-form-item label="间隔推送延迟时间(秒)" prop="delayTime">
          <el-input v-model="form.delayTime" placeholder="请输入间隔推送延迟时间(秒)" />
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
import { listNotificationTpls, getNotificationTpls, delNotificationTpls, addNotificationTpls, updateNotificationTpls, changeStatus } from "@/api/community/notificationTpls";

export default {
  name: "NotificationTpls",
  dicts: ['sys_normal_disable', 'notificationTpls_type', 'sys_common_status'],
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
      // 系统通知模板表格数据
      notificationTplsList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        id: undefined,
        noticeId: undefined,
        status: undefined,
        type: undefined,
        typeName: undefined,
        title: undefined,
        content: undefined,
        vars: undefined,
        templateId: undefined,
        firstData: undefined,
        keywordsData: undefined,
        remarkData: undefined,
        color: undefined,
        redirectType: undefined,
        redirectUrl: undefined,
        pagePath: undefined,
        isError: undefined,
        errorMsg: undefined,
        pushType: undefined,
        delayTime: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询系统通知模板列表 */
    getList() {
      this.loading = true;
      listNotificationTpls(this.queryParams).then(response => {
        this.notificationTplsList = response.rows;
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
        id: undefined,
        noticeId: undefined,
        status: 0,
        type: undefined,
        typeName: undefined,
        title: undefined,
        content: undefined,
        vars: undefined,
        templateId: undefined,
        firstData: undefined,
        keywordsData: undefined,
        remarkData: undefined,
        color: undefined,
        redirectType: undefined,
        redirectUrl: undefined,
        pagePath: undefined,
        isError: undefined,
        errorMsg: undefined,
        pushType: undefined,
        delayTime: undefined,
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
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加系统通知模板";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.loading = true;
      this.reset();
      const id = row.id || this.ids
      getNotificationTpls(id).then(response => {
        this.loading = false;
        this.form = response.data;
        this.open = true;
        this.title = "修改系统通知模板";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.buttonLoading = true;
          if (this.form.id != null) {
            updateNotificationTpls(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            }).finally(() => {
              this.buttonLoading = false;
            });
          } else {
            addNotificationTpls(this.form).then(response => {
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
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除系统通知模板编号为"' + ids + '"的数据项？').then(() => {
        this.loading = true;
        return delNotificationTpls(ids);
      }).then(() => {
        this.loading = false;
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).finally(() => {
        this.loading = false;
      });
    },
    // 状态修改
    handleStatus(row) {
      let text = row.status === "1" ? "启用" : "停用";
      this.$modal.confirm('确认要"' + text + '"吗？').then(function() {
        return changeStatus(row.id, row.status);
      }).then(() =>{
        this.$modal.msgSuccess(text + "成功");
        this.getList();
      }).catch(function() {
        row.status = row.status === "0" ? "1" : "0";
      });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('community/notificationTpls/export', {
        ...this.queryParams
      }, `notificationTpls_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
