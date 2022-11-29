<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" class="queryForm" :inline="true" v-show="showSearch" label-width="100px">
      <el-form-item label="信息类型编码" prop="code">
        <el-input v-model="queryParams.code" placeholder="请输入信息类型编码" clearable size="small" @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="信息类型名称" prop="label">
        <el-input v-model="queryParams.label" placeholder="请输入信息类型名称" clearable size="small" @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="基本信息值" prop="value">
        <el-input v-model="queryParams.value" placeholder="请输入基本信息值" clearable size="small" @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['business:basicInfo:add']">新增</el-button>
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['business:basicInfo:edit']"
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
          v-hasPermi="['business:basicInfo:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['business:basicInfo:export']"
        >导出</el-button>
      </el-col> -->
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="basicInfoList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <!-- <el-table-column label="" align="center" prop="id" v-if="true" /> -->
      <el-table-column label="信息类型编码" align="center" prop="code" />
      <el-table-column label="信息类型名称英文" align="center" prop="labelCn" />
      <el-table-column label="信息类型名称英文" align="center" prop="labelEn" />
      <!-- <el-table-column label="基本信息值" align="center" prop="value" /> -->
      <el-table-column label="基本信息值" align="center" prop="valueCn" width="300">
        <template slot-scope="scope">
          <div align="center" prop="valueCn" width="300" v-if="scope.row.type==0">
            {{scope.row.valueCn}}
          </div>
          <div align="center" prop="valueCn" width="300" v-else>
            <template>
              <el-image style="max-width: 50px; max-height: 50px" :src="scope.row.valueCn">
              </el-image>
            </template>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="基本信息值英文" align="center" prop="valueEn" width="300">
        <template slot-scope="scope">
          <div align="center" prop="valueEn" width="300" v-if="scope.row.type==0">
            {{scope.row.valueEn}}
          </div>
          <div align="center" prop="valueEn" width="300" v-else>
            <template>
              <el-image style="max-width: 50px; max-height: 50px" :src="scope.row.valueEn">
              </el-image>
            </template>
          </div>
        </template>
      </el-table-column>
      <!-- <el-table-column label="类型：0文字，1图片" align="center" prop="type" /> -->
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-hasPermi="['business:basicInfo:edit']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-hasPermi="['business:basicInfo:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />

    <!-- 添加或修改基本信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="50vw" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="160px">
        <el-form-item label="信息类型编码" prop="code">
          <el-input v-model="form.code" placeholder="请输入信息类型编码" />
        </el-form-item>
        <el-form-item label="信息类型名称" prop="label">
          <el-input v-model="form.labelCn" placeholder="请输入信息类型名称" />
        </el-form-item>
        <el-form-item label="信息类型名称英文" prop="label">
          <el-input v-model="form.labelEn" placeholder="请输入信息类型名称" />
        </el-form-item>
        <el-form-item label="状态" prop="type">
          <el-radio-group v-model="form.type">
            <el-radio label="0">文字</el-radio>
            <el-radio label="1">图片</el-radio>
          </el-radio-group>
        </el-form-item>
        <template v-if="form.type == 0">
          <el-form-item label="基本信息值" prop="valueCn">
            <el-input v-model="form.valueCn" placeholder="请输入基本信息值" />
          </el-form-item>
          <el-form-item label="基本信息值英文" prop="valueEn">
            <el-input v-model="form.valueEn" placeholder="请输入基本信息值" />
          </el-form-item>
        </template>
        <template v-if="form.type == 1">
          <el-form-item label="中文图片上传">
            <imageUpload v-model="form.valueCn" />
          </el-form-item>
          <el-form-item label="英文图片上传">
            <imageUpload v-model="form.valueEn" />
          </el-form-item>
        </template>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :loading="buttonLoading" type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listBasicInfo, getBasicInfo, delBasicInfo, addBasicInfo, updateBasicInfo } from "@/api/business/basicInfo";

export default {
  name: "BasicInfo",
  data () {
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
      // 基本信息表格数据
      basicInfoList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        code: undefined,
        label: undefined,
        value: undefined,
        type: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        id: [
          { required: true, message: "不能为空", trigger: "blur" }
        ],
        code: [
          { required: true, message: "信息类型编码不能为空", trigger: "blur" }
        ],
        labelCn: [
          { required: true, message: "信息类型名称不能为空", trigger: "blur" }
        ],
        valueCn: [
          { required: true, message: "基本信息值不能为空", trigger: "blur" }
        ],
        type: [
          { required: true, message: "类型：0文字，1图片不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created () {
    this.getList();
  },
  methods: {
    /** 查询基本信息列表 */
    getList () {
      this.loading = true;
      listBasicInfo(this.queryParams).then(response => {
        this.basicInfoList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel () {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset () {
      this.form = {
        id: undefined,
        code: undefined,
        labelCn: undefined,
        labelEn: undefined,
        valueCn: undefined,
        valueEn: undefined,
        delFlag: undefined,
        createBy: undefined,
        createTime: undefined,
        updateBy: undefined,
        updateTime: undefined,
        type: "0"
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery () {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery () {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange (selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd () {
      this.reset();
      this.open = true;
      this.title = "添加基本信息";
    },
    /** 修改按钮操作 */
    handleUpdate (row) {
      this.loading = true;
      this.reset();
      const id = row.id || this.ids
      getBasicInfo(id).then(response => {
        this.loading = false;
        this.form = response.data;
        this.open = true;
        this.title = "修改基本信息";
      });
    },
    /** 提交按钮 */
    submitForm () {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.buttonLoading = true;
          if (this.form.id != null) {
            updateBasicInfo(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            }).finally(() => {
              this.buttonLoading = false;
            });
          } else {
            addBasicInfo(this.form).then(response => {
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
    handleDelete (row) {
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除基本信息编号为"' + ids + '"的数据项？').then(() => {
        this.loading = true;
        return delBasicInfo(ids);
      }).then(() => {
        this.loading = false;
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).finally(() => {
        this.loading = false;
      });
    },
    /** 导出按钮操作 */
    handleExport () {
      this.download('business/basicInfo/export', {
        ...this.queryParams
      }, `basicInfo_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
