<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="模块标题" prop="moduleTitle">
        <el-input
          v-model="queryParams.moduleTitle"
          placeholder="请输入模块标题"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="模块标题描述" prop="moduleContent">
        <el-input
          v-model="queryParams.moduleContent"
          placeholder="请输入模块标题描述"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="模块编码" prop="moduleCode">
        <el-input
          v-model="queryParams.moduleCode"
          placeholder="请输入模块编码"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['business:module:add']"
        >新增</el-button>
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['business:module:edit']"
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
          v-hasPermi="['business:module:remove']"
        >删除</el-button>
      </el-col> -->
      <!-- <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['business:module:export']"
        >导出</el-button>
      </el-col> -->
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="moduleList" @selection-change="handleSelectionChange">
      <!-- <el-table-column type="selection" width="55" align="center" /> -->
      <!-- <el-table-column label="模块id" align="center" prop="moduleId" v-if="true"/> -->
      <el-table-column label="模块标题" align="center" prop="moduleTitle" />
      <el-table-column label="模块标题英文" align="center" prop="moduleTitleEn" />
      <el-table-column label="模块标题描述" align="center" prop="moduleContent"  show-overflow-tooltip/>
      <el-table-column label="模块标题描述英文" align="center" prop="moduleContentEn"  show-overflow-tooltip/>
      <el-table-column label="模块编码" align="center" prop="moduleCode" />
      <el-table-column label="模块图片" align="center" prop="moduleImg">
        <template slot-scope="scope">
          <el-image
            style="max-width: 50px; max-height: 50px"
            :src="scope.row.moduleImg">
          </el-image>
        </template>
       </el-table-column>
      <el-table-column label="所属类型" align="center" prop="type" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['business:module:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['business:module:remove']"
          >删除</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handlemoduleDetail(scope.row)"
            v-hasPermi="['business:moduleDetail:edit']"
          >内容管理</el-button>
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

    <!-- 添加或修改内容模块对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="模块标题" prop="moduleTitle">
          <el-input v-model="form.moduleTitle" placeholder="请输入模块标题" />
        </el-form-item>
        <el-form-item label="模块标题英文" prop="moduleTitleEn">
          <el-input v-model="form.moduleTitleEn" placeholder="请输入模块标题英文" />
        </el-form-item>
        <el-form-item label="模块标题描述" prop="moduleContent">
          <el-input v-model="form.moduleContent" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="模块标题描述英文" prop="moduleContentEn">
          <el-input v-model="form.moduleContentEn" type="textarea" placeholder="请输入内容英文" />
        </el-form-item>
        <el-form-item label="模块编码" prop="moduleCode">
          <el-input v-model="form.moduleCode" placeholder="请输入模块编码" />
        </el-form-item>
        <el-form-item label="模块图片">
          <imageUpload v-model="form.moduleImg"/>
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
import { listmodule, getmodule, delmodule, addmodule, updatemodule } from "@/api/business/module";

export default {
  name: "module",
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
      // 内容模块表格数据
      moduleList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        moduleTitle: undefined,
        moduleContent: undefined,
        moduleCode: undefined,
        moduleImg: undefined,
        type: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        moduleId: [
          { required: true, message: "模块id不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.queryParams.type = this.$route.query.type;
    this.getList();
  },
  methods: {
    /** 查询内容模块列表 */
    getList() {
      this.loading = true;
      listmodule(this.queryParams).then(response => {
        this.moduleList = response.rows;
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
        moduleId: undefined,
        moduleTitle: undefined,
        moduleContent: undefined,
        moduleCode: undefined,
        moduleImg: undefined,
        type: undefined,
        delFlag: undefined,
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
      this.ids = selection.map(item => item.moduleId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加内容模块";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.loading = true;
      this.reset();
      const moduleId = row.moduleId || this.ids
      getmodule(moduleId).then(response => {
        this.loading = false;
        this.form = response.data;
        this.open = true;
        this.title = "修改内容模块";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        this.form.type = this.$route.query.type;
        if (valid) {
          this.buttonLoading = true;
          if (this.form.moduleId != null) {
            updatemodule(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            }).finally(() => {
              this.buttonLoading = false;
            });
          } else {
            addmodule(this.form).then(response => {
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
      const moduleIds = row.moduleId || this.ids;
      this.$modal.confirm('是否确认删除内容模块编号为"' + moduleIds + '"的数据项？').then(() => {
        this.loading = true;
        return delmodule(moduleIds);
      }).then(() => {
        this.loading = false;
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).finally(() => {
        this.loading = false;
      });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('business/module/export', {
        ...this.queryParams
      }, `module_${new Date().getTime()}.xlsx`)
    },
    /** 新增内容详情操作 */
    handlemoduleDetail: function(row) {
      const moduleId = row.moduleId;
      this.$router.push("/module/moduleDetail/" + moduleId);
    }
  }
};
</script>
