<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="业务标题" prop="title">
        <el-input v-model="queryParams.title" placeholder="请输入业务标题" clearable size="small" @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['business:cardBusiness:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate" v-hasPermi="['business:cardBusiness:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete" v-hasPermi="['business:cardBusiness:remove']">删除</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="cardBusinessList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="主键" align="center" prop="id" v-if="true" />
      <el-table-column label="公司" align="center" prop="cardCompanyInfo.companyName"" />
      <el-table-column label=" 业务标题" align="center" prop="title" />
      <el-table-column label="业务介绍" align="center" prop="introduction" />
      <el-table-column label="视频地址" align="center" prop="videoUrl" width="200">
        <template slot-scope="scope">
          <video :src="scope.row.videoUrl" style="width:100%;height:100%;object-fit:cover" controls="controls" v-if="scope.row.videoUrl">
            您的浏览器不支持视频播放
          </video>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-hasPermi="['business:cardBusiness:edit']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-hasPermi="['business:cardBusiness:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />

    <!-- 添加或修改名片业务对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="900px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="业务标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入业务标题" />
        </el-form-item>
        <el-form-item label="业务介绍" prop="introduction">
          <el-input v-model="form.introduction" type="textarea" autosize placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="视频地址">
          <video :src="form.videoUrl" controls="controls" style="width: 200px" v-if="form.videoUrl">
            您的浏览器不支持视频播放
          </video>
          <fileUpload v-model="form.videoUrl" />
        </el-form-item>
        <el-form-item label="公司" prop="companyId">
          <el-select v-model="form.companyId" placeholder="请选择公司" clearable :style="{width: '100%'}">
            <el-option v-for="(item, index) in companyList" :key="index" :label="item.companyName" :value="item.id" :disabled="item.disabled"></el-option>
          </el-select>
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
import { listCardBusiness, getCardBusiness, delCardBusiness, addCardBusiness, updateCardBusiness, companyList } from "@/api/business/cardBusiness";

export default {
  name: "CardBusiness",
  data () {
    return {
      //公司列表
      companyList: [],
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
      // 名片业务表格数据
      cardBusinessList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        title: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        id: [
          { required: true, message: "主键不能为空", trigger: "blur" }
        ],
        companyId: [
          { required: true, message: "关联公司id不能为空", trigger: "change" }
        ],
        title: [
          { required: true, message: "业务标题不能为空", trigger: "blur" }
        ],
        introduction: [
          { required: true, message: "业务介绍不能为空", trigger: "blur" }
        ],
        videoUrl: [
          { required: true, message: "视频地址不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created () {
    this.getList();
    companyList().then(response => {
      this.companyList = response.data;
      console.log(this.companyList);
    });
  },
  methods: {
    /** 查询名片业务列表 */
    getList () {
      this.loading = true;
      listCardBusiness(this.queryParams).then(response => {
        this.cardBusinessList = response.rows;
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
        companyId: undefined,
        title: undefined,
        introduction: undefined,
        videoUrl: undefined,
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
      this.ids = selection.map(item => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd () {
      this.reset();
      this.open = true;
      this.title = "添加名片业务";
    },
    /** 修改按钮操作 */
    handleUpdate (row) {
      this.loading = true;
      this.reset();
      const id = row.id || this.ids
      getCardBusiness(id).then(response => {
        this.loading = false;
        this.form = response.data;
        this.open = true;
        this.title = "修改名片业务";
      });
    },
    /** 提交按钮 */
    submitForm () {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.buttonLoading = true;
          if (this.form.id != null) {
            updateCardBusiness(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            }).finally(() => {
              this.buttonLoading = false;
            });
          } else {
            addCardBusiness(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除名片业务编号为"' + ids + '"的数据项？').then(() => {
        this.loading = true;
        return delCardBusiness(ids);
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
      this.download('business/cardBusiness/export', {
        ...this.queryParams
      }, `cardBusiness_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
