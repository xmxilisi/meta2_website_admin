<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" class="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="详情标题" prop="titleCn">
        <el-input v-model="queryParams.titleCn" placeholder="请输入详情标题" clearable size="small" @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="内容" prop="contentCn">
        <el-input v-model="queryParams.contentCn" placeholder="请输入内容" clearable size="small" @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="编码" prop="code">
        <el-input v-model="queryParams.code" placeholder="请输入编码" clearable size="small" @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['business:moduleDetail:add']">新增</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="moduleDetailList" @selection-change="handleSelectionChange">
      <!-- <el-table-column type="selection" width="55" align="center" /> -->
      <!-- <el-table-column label="详情id" align="center" prop="detailId" v-if="true"/> -->
      <!-- <el-table-column label="关联模块id" align="center" prop="moduleId" /> -->
      <el-table-column label="详情标题" align="center" prop="titleCn" />
      <el-table-column label="详情标题英文" align="center" prop="titleEn" />
      <el-table-column label="内容" align="center" prop="contentCn" show-overflow-tooltip />
      <el-table-column label="内容英文" align="center" prop="contentEn" show-overflow-tooltip />
      <el-table-column label="图片" align="center" prop="img">
        <template slot-scope="scope" v-if="scope.row.img">
          <el-image style="max-width: 50px; max-height: 50px" :src="scope.row.img">
          </el-image>
        </template>
      </el-table-column>
      <el-table-column label="小图标" align="center" prop="icon">
        <template slot-scope="scope" v-if="scope.row.icon">
          <el-image style="max-width: 50px; max-height: 50px" :src="scope.row.icon">
          </el-image>
        </template>
      </el-table-column>
      <el-table-column label="小图标名称" align="center" prop="iconNameCn" show-overflow-tooltip />
      <el-table-column label="小图标名称英文" align="center" prop="iconNameEn" show-overflow-tooltip />
      <el-table-column label="编码" align="center" prop="code" />
      <el-table-column label="序号" align="center" prop="sort" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-hasPermi="['business:moduleDetail:edit']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-hasPermi="['business:moduleDetail:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />

    <!-- 添加或修改内容模块详情对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="50vw" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="130px">
        <!-- <el-form-item label="关联模块id" prop="moduleId">
          <el-input v-model="form.moduleId" placeholder="请输入关联模块id" />
        </el-form-item> -->
        <el-form-item label="详情标题" prop="titleCn">
          <el-input v-model="form.titleCn" placeholder="请输入详情标题" />
        </el-form-item>
        <el-form-item label="详情标题英文" prop="titleEn">
          <el-input v-model="form.titleEn" placeholder="请输入详情标题英文" />
        </el-form-item>
        <el-form-item label="内容" prop="contentCn">
          <el-input v-model="form.contentCn" type="textarea" placeholder="请输入内容" autosize resize="none" />
        </el-form-item>
        <el-form-item label="内容英文" prop="contentEn">
          <el-input v-model="form.contentEn" type="textarea" placeholder="请输入内容英文" autosize resize="none" />
        </el-form-item>
        <el-form-item label="图片">
          <imageUpload v-model="form.img" />
        </el-form-item>
        <el-form-item label="小图标">
          <imageUpload v-model="form.icon" />
        </el-form-item>
        <el-form-item label="小图标名称" prop="iconNameCn">
          <el-input v-model="form.iconNameCn" type="textarea" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="小图标名称英文" prop="iconNameEn">
          <el-input v-model="form.iconNameEn" type="textarea" placeholder="请输入名称英文" />
        </el-form-item>
        <el-form-item label="编码" prop="code">
          <el-input v-model="form.code" placeholder="请输入编码" />
        </el-form-item>
        <el-form-item label="序号" prop="code">
          <el-input v-model="form.sort" placeholder="请输入序号" />
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
import { listmoduleDetail, getmoduleDetail, delmoduleDetail, addmoduleDetail, updatemoduleDetail } from "@/api/business/moduleDetail";

export default {
  name: "moduleDetail",
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
      // 内容模块详情表格数据
      moduleDetailList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        moduleId: undefined,
        titleCn: undefined,
        contentCn: undefined,
        img: undefined,
        code: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        detailId: [
          { required: true, message: "详情id不能为空", trigger: "blur" }
        ],
        moduleId: [
          { required: true, message: "关联模块id不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created () {
    this.queryParams.moduleId = this.$route.params.moduleId;
    this.getList();
  },
  methods: {
    /** 查询内容模块详情列表 */
    getList () {
      this.loading = true;
      listmoduleDetail(this.queryParams).then(response => {
        this.moduleDetailList = response.rows;
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
        detailId: undefined,
        moduleId: undefined,
        titleCn: undefined,
        contentCn: undefined,
        img: undefined,
        code: undefined,
        sort: undefined,
        delFlag: undefined,
        createBy: undefined,
        createTime: undefined,
        updateBy: undefined,
        updateTime: undefined
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
      this.ids = selection.map(item => item.detailId)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd () {
      this.reset();
      this.open = true;
      this.title = "添加内容模块详情";
    },
    /** 修改按钮操作 */
    handleUpdate (row) {
      this.loading = true;
      this.reset();
      const detailId = row.detailId || this.ids
      getmoduleDetail(detailId).then(response => {
        this.loading = false;
        this.form = response.data;
        this.open = true;
        this.title = "修改内容模块详情";
      });
    },
    /** 提交按钮 */
    submitForm () {
      this.form.moduleId = this.$route.params.moduleId;
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.buttonLoading = true;
          if (this.form.detailId != null) {
            updatemoduleDetail(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            }).finally(() => {
              this.buttonLoading = false;
            });
          } else {
            addmoduleDetail(this.form).then(response => {
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
      const detailIds = row.detailId || this.ids;
      this.$modal.confirm('是否确认删除内容模块详情编号为"' + detailIds + '"的数据项？').then(() => {
        this.loading = true;
        return delmoduleDetail(detailIds);
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
      this.download('business/moduleDetail/export', {
        ...this.queryParams
      }, `moduleDetail_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
