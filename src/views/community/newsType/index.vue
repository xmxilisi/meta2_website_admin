<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="分类 id" prop="id">
        <el-input
          v-model="queryParams.id"
          placeholder="请输入分类 id"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="分类名称" prop="newsName">
        <el-input
          v-model="queryParams.newsName"
          placeholder="请输入分类名称"
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
          v-hasPermi="['community:newsType:add']"
        >新增</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="newsTypeList"
      row-key="id"
      default-expand-all
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column label="分类名称">
        <template slot-scope="scope">
          <span>{{ scope.row.newsName }}</span><span style="padding-left: 10px;">(ID:{{ scope.row.id }})</span>
        </template>
      </el-table-column>
      <el-table-column label="中文名称" align="center" prop="newsNameChinese" />
      <el-table-column label="图标" align="center" prop="icon">
        <template slot-scope="scope">
          <el-image
            style="width: 50px; height: 50px"
            :src="scope.row.icon">
          </el-image>
        </template>
      </el-table-column>
      <el-table-column label="顺序" align="center" prop="sort" />
      <!--
      <el-table-column label="状态" align="center" prop="status" >
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sys_normal_disable" :value="scope.row.status"/>
        </template>
      </el-table-column>
      -->
      <el-table-column label="状态" align="center" prop="status">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            active-value="0"
            inactive-value="1"
            @change="handleClose2(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <!--
          <el-button
            size="mini"
            type="text"
            icon="el-icon-circle-close"
            @click="handleClose(scope.row)"
            v-hasPermi="['community:newsType:close']"
          >
            <span v-if="scope.row.status === '0'">禁用</span><span v-else>启用</span>
          </el-button>
          -->
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['community:newsType:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-plus"
            @click="handleAdd(scope.row)"
            v-hasPermi="['community:newsType:add']"
          >新增</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['community:newsType:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改分类管理对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="分类名称" prop="newsName">
          <el-input v-model="form.newsName" placeholder="请输入分类名称" />
        </el-form-item>
        <el-form-item label="分类描述" prop="description">
          <el-input v-model="form.description" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="分类名称（中文）" prop="newsNameChinese">
          <el-input v-model="form.newsNameChinese" placeholder="请输入分类名称" />
        </el-form-item>
        <el-form-item label="分类描述（中文）" prop="descriptionChinese">
          <el-input v-model="form.descriptionChinese" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="分类图标">
          <imageUpload v-model="form.icon"/>
        </el-form-item>
        <el-form-item label="显示顺序" prop="sort">
          <el-input v-model="form.sort" placeholder="请输入显示顺序" />
        </el-form-item>
        <el-form-item label="上级分类" prop="parentId">
          <treeselect v-model="form.parentId" :options="newsTypeOptions" :normalizer="normalizer" placeholder="请选择上级分类" />
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
import { listNewsType, getNewsType, delNewsType, addNewsType, updateNewsType } from "@/api/community/newsType";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import {changeStatus} from "@/api/community/newsType";

export default {
  name: "NewsType",
  components: {
    Treeselect
  },
  dicts: ['sys_normal_disable'],
  data() {
    return {
      // 按钮loading
      buttonLoading: false,
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 分类管理表格数据
      newsTypeList: [],
      // 分类管理树选项
      newsTypeOptions: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        id: null,
        newsName: null,
        description: null,
        icon: null,
        sort: null,
        status: null,
        parentId: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        parentId: [
          { required: true, message: "所属一级分类的ID不能为空", trigger: "blur" }
        ],
        newsName: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询分类管理列表 */
    getList() {
      this.loading = true;
      listNewsType(this.queryParams).then(response => {
        this.newsTypeList = this.handleTree(response.data, "id", "parentId");
        this.loading = false;
      });
    },
    /** 转换分类管理数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.id,
        label: node.newsName,
        children: node.children
      };
    },
	/** 查询分类管理下拉树结构 */
    getTreeselect() {
      listNewsType().then(response => {
        this.newsTypeOptions = [];
        const data = { id: 0, newsName: '顶级节点', children: [] };
        data.children = this.handleTree(response.data, "id", "parentId");
        this.newsTypeOptions.push(data);
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
        id: null,
        newsName: null,
        description: null,
        newsNameChinese: null,
        descriptionChinese: null,
        icon: null,
        sort: null,
        status: 0,
        parentId: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 新增按钮操作 */
    handleAdd(row) {
      this.reset();
      this.getTreeselect();
      if (row != null && row.id) {
        this.form.parentId = row.id;
      } else {
        this.form.parentId = 0;
      }
      this.open = true;
      this.title = "添加分类管理";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
	  this.loading = true;
      this.reset();
      this.getTreeselect();
      if (row != null) {
        this.form.parentId = row.id;
      }
      getNewsType(row.id).then(response => {
	    this.loading = false;
        this.form = response.data;
        this.open = true;
        this.title = "修改分类管理";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
		  this.buttonLoading = true;
          if (this.form.id != null) {
            updateNewsType(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            }).finally(() => {
              this.buttonLoading = false;
            });
          } else {
            addNewsType(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除分类管理编号为"' + row.id + '"的数据项？').then(() => {
        this.loading = true;
        return delNewsType(row.id);
      }).then(() => {
        this.loading = false;
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).finally(() => {
        this.loading = false;
      });
    },
    // 状态修改
    handleClose(row) {
      let text = row.status === "0" ? "停用" : "启用";
      const nid = row.id || this.ids;
      this.$modal.confirm('确认要"' + text + '"吗？').then(function() {
        const status = row.status === "0" ? "1" : "0";
        return changeStatus(nid, status);
      }).then(() =>{
        this.$modal.msgSuccess(text + "成功");
        this.getList();
      }).catch(function() {
        row.status = row.status === "0" ? "0" : "1";
      });
    }
    ,
    // 状态修改
    handleClose2(row) {
      let text = row.status === "0" ? "启用" : "停用";
      this.$modal.confirm('确认要"' + text + '"吗？').then(function() {
        return changeStatus(row.id, row.status);
      }).then(() => {
        this.$modal.msgSuccess(text + "成功");
      }).catch(function() {
        row.status = row.status === "0" ? "1" : "0";
      });
    }
  }
};
</script>
