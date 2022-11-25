<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="姓名中文" prop="nameCn">
        <el-input
          v-model="queryParams.nameCn"
          placeholder="请输入姓名中文"
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
          v-hasPermi="['business:teammate:add']"
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
          v-hasPermi="['business:teammate:edit']"
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
          v-hasPermi="['business:teammate:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['business:teammate:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="teammateList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="" align="center" prop="id" v-if="true"/>
      <el-table-column label="姓名中文" align="center" prop="nameCn" />
      <el-table-column label="姓名英文" align="center" prop="nameEn" />
      <el-table-column label="教育中文" align="center" prop="educationCn" />
      <el-table-column label="岗位中文" align="center" prop="jobCn" />
      <el-table-column label="教育英文" align="center" prop="educationEn" />
      <el-table-column label="岗位英文" align="center" prop="jobEn" />
      <el-table-column label="岗位介绍中文" align="center" prop="jonDescriptionCn" />
      <el-table-column label="描述中文" align="center" prop="describeCn" />
      <el-table-column label="描述英文" align="center" prop="describeEn" />
      <el-table-column label="岗位介绍英文" align="center" prop="jonDescriptionEn" />
      <el-table-column label="排序" align="center" prop="sort" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['business:teammate:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['business:teammate:remove']"
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

    <!-- 添加或修改团队成员对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="姓名中文" prop="nameCn">
          <el-input v-model="form.nameCn" placeholder="请输入姓名中文" />
        </el-form-item>
        <el-form-item label="姓名英文" prop="nameEn">
          <el-input v-model="form.nameEn" placeholder="请输入姓名英文" />
        </el-form-item>
        <el-form-item label="教育中文" prop="educationCn">
          <el-input v-model="form.educationCn" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="教育英文" prop="educationEn">
          <el-input v-model="form.educationEn" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="岗位中文" prop="jobCn">
          <el-input v-model="form.jobCn" placeholder="请输入岗位中文" />
        </el-form-item>
        <el-form-item label="岗位英文" prop="jobEn">
          <el-input v-model="form.jobEn" placeholder="请输入岗位英文" />
        </el-form-item>
        <el-form-item label="岗位介绍中文" prop="jonDescriptionCn">
          <el-input v-model="form.jonDescriptionCn" placeholder="请输入岗位介绍中文" />
        </el-form-item>
        <el-form-item label="岗位介绍英文" prop="jonDescriptionEn">
          <el-input v-model="form.jonDescriptionEn" placeholder="请输入岗位介绍英文" />
        </el-form-item>
        <el-form-item label="描述中文" prop="describeCn">
          <el-input v-model="form.describeCn" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="描述英文" prop="describeEn">
          <el-input v-model="form.describeEn" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        
        <el-form-item label="排序" prop="sort">
          <el-input v-model="form.sort" placeholder="请输入排序" />
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
import { listTeammate, getTeammate, delTeammate, addTeammate, updateTeammate } from "@/api/business/teammate";

export default {
  name: "Teammate",
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
      // 团队成员表格数据
      teammateList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        nameCn: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        id: [
          { required: true, message: "不能为空", trigger: "blur" }
        ],
        nameCn: [
          { required: true, message: "姓名中文不能为空", trigger: "blur" }
        ],
        nameEn: [
          { required: true, message: "姓名英文不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询团队成员列表 */
    getList() {
      this.loading = true;
      listTeammate(this.queryParams).then(response => {
        this.teammateList = response.rows;
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
        nameCn: undefined,
        nameEn: undefined,
        educationCn: undefined,
        jobCn: undefined,
        educationEn: undefined,
        jobEn: undefined,
        jonDescriptionCn: undefined,
        describeCn: undefined,
        describeEn: undefined,
        jonDescriptionEn: undefined,
        sort: undefined,
        image: undefined,
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
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加团队成员";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.loading = true;
      this.reset();
      const id = row.id || this.ids
      getTeammate(id).then(response => {
        this.loading = false;
        this.form = response.data;
        this.open = true;
        this.title = "修改团队成员";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.buttonLoading = true;
          if (this.form.id != null) {
            updateTeammate(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            }).finally(() => {
              this.buttonLoading = false;
            });
          } else {
            addTeammate(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除团队成员编号为"' + ids + '"的数据项？').then(() => {
        this.loading = true;
        return delTeammate(ids);
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
      this.download('business/teammate/export', {
        ...this.queryParams
      }, `teammate_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
