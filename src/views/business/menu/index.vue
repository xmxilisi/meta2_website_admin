<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="中文名称" prop="nameCn">
        <el-input
          v-model="queryParams.nameCn"
          placeholder="请输入中文名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="英文名称" prop="nameEn">
        <el-input
          v-model="queryParams.nameEn"
          placeholder="请输入英文名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>


      <el-form-item label="编码" prop="code">
        <el-input
          v-model="queryParams.code"
          placeholder="请输入编码"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="展示位置" prop="place">
        <el-select v-model="queryParams.place" placeholder="请选择展示位置(0全部，1顶部，2底部)" clearable size="small">
          <el-option
            v-for="dict in dict.type.cmny_menu_place"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
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
          v-hasPermi="['business:menu:add']"
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
          v-hasPermi="['business:menu:edit']"
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
          v-hasPermi="['business:menu:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['business:menu:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-if="refreshTable" v-loading="loading" :data="menuList" row-key="navId"
      :default-expand-all="isExpandAll"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}" >
<!--      <el-table-column label="菜单id" align="center" prop="navId" v-if="true"/> -->
      <el-table-column label="中文名称" align="center" prop="nameCn" />
      <el-table-column label="英文名称" align="center" prop="nameEn" />
      <el-table-column label="父菜单ID" align="center" prop="parentId" />
      <el-table-column label="显示顺序" align="center" prop="orderNum" />
      <el-table-column label="请求地址" align="center" prop="url" />
      <el-table-column label="菜单状态" align="center" prop="visible">
        <template slot-scope="scope">
          <span v-if="scope.row.target == '0'">显示</span>
          <span v-if="scope.row.target == '1'">隐藏</span>
        </template>
      </el-table-column>
      <el-table-column label="打开方式" align="center" prop="target">
        <template slot-scope="scope">
          <span v-if="scope.row.target == '0'">页签</span>
          <span v-if="scope.row.target == '1'">新窗口</span>
        </template>
      </el-table-column>
      <el-table-column label="备注中文" align="center" prop="remarkCn" />
      <el-table-column label="备注英文" align="center" prop="remarkEn" />
      <el-table-column label="菜单级别" align="center" prop="level" />
      <el-table-column label="编码" align="center" prop="code" />
      <el-table-column label="展示位置(0全部，1顶部，2底部)" align="center" prop="place">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.cmny_menu_place" :value="scope.row.place"/>
        </template>
      </el-table-column>
      <el-table-column label="是否推荐" align="center" prop="isRecommend">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sys_yes_no" :value="scope.row.isRecommend"/>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['business:menu:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-plus"
            @click="handleAdd(scope.row)"
            v-hasPermi="['business:menu:add']"
          >新增</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['business:menu:remove']"
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

    <!-- 添加或修改官网导航栏菜单对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="上级菜单">
          <treeselect
            v-model="form.parentId"
            :options="menuOptions"
            :normalizer="normalizer"
            :show-count="true"
            placeholder="选择上级菜单"
          />
        </el-form-item>
        <el-form-item label="中文名称" prop="nameCn">
          <el-input v-model="form.nameCn" placeholder="请输入中文名称" />
        </el-form-item>
        <el-form-item label="英文名称" prop="nameEn">
          <el-input v-model="form.nameEn" placeholder="请输入英文名称" />
        </el-form-item>
        <el-form-item label="父菜单ID" prop="parentId">
          <el-input v-model="form.parentId" placeholder="请输入父菜单ID" />
        </el-form-item>
        <el-form-item label="显示顺序" prop="orderNum">
          <el-input v-model="form.orderNum" placeholder="请输入显示顺序" />
        </el-form-item>
        <el-form-item label="请求地址" prop="url">
          <el-input v-model="form.url" placeholder="请输入请求地址" />
        </el-form-item>
        <el-form-item label="菜单状态" prop="visible">
          <el-input v-model="form.visible" placeholder="请输入菜单状态" />
        </el-form-item>
        <el-form-item label="打开方式" prop="target">
          <el-input v-model="form.target" placeholder="请输入打开方式" />
        </el-form-item>
        <el-form-item label="备注中文" prop="remarkCn">
          <el-input v-model="form.remarkCn" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="备注英文" prop="remarkEn">
          <el-input v-model="form.remarkEn" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="编码" prop="code">
          <el-input v-model="form.code" placeholder="请输入编码" />
        </el-form-item>
        <el-form-item label="seo标题中文" prop="seoTitleCn">
          <el-input v-model="form.seoTitleCn" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="seo标题英文" prop="seoTitleEn">
          <el-input v-model="form.seoTitleEn" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="seo标签中文" prop="seoLabelCn">
          <el-input v-model="form.seoLabelCn" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="seo标签英文" prop="seoLabelEn">
          <el-input v-model="form.seoLabelEn" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="seo描述中文" prop="seoDescribeCn">
          <el-input v-model="form.seoDescribeCn" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="seo描述英文" prop="seoDescribeEn">
          <el-input v-model="form.seoDescribeEn" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="展示位置">
          <el-radio-group v-model="form.place">
            <el-radio
              v-for="dict in dict.type.cmny_menu_place"
              :key="dict.value"
:label="dict.value"
            >{{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否推荐">
          <el-radio-group v-model="form.isRecommend">
            <el-radio
              v-for="dict in dict.type.sys_yes_no"
              :key="dict.value"
:label="dict.value"
            >{{dict.label}}</el-radio>
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
import { listMenu, getMenu, delMenu, addMenu, updateMenu } from "@/api/business/menu";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import IconSelect from "@/components/IconSelect";
export default {
  name: "Menu",
  dicts: ['cmny_menu_place', 'sys_yes_no'],
  components: { Treeselect, IconSelect },
  data() {
    return {
      // 按钮loading
      buttonLoading: false,
      // 遮罩层
      loading: true,
      // 是否展开，默认全部折叠
      isExpandAll: false,
      // 重新渲染表格状态
      refreshTable: true,
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
      // 官网导航栏菜单表格数据
      menuList: [],
      // 弹出层标题
      title: "",
      // 菜单树选项
      menuOptions: [],
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        nameCn: undefined,
        nameEn: undefined,
        parentId: undefined,
        orderNum: undefined,
        url: undefined,
        visible: undefined,
        target: undefined,
        level: undefined,
        code: undefined,
        place: undefined,
        isRecommend: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        navId: [
          { required: true, message: "菜单id不能为空", trigger: "blur" }
        ],
        nameCn: [
          { required: true, message: "中文名称不能为空", trigger: "blur" }
        ],
        parentId: [
          { required: true, message: "父菜单ID不能为空", trigger: "blur" }
        ],
        orderNum: [
          { required: true, message: "显示顺序不能为空", trigger: "blur" }
        ],
        place: [
          { required: true, message: "展示位置(0全部，1顶部，2底部)不能为空", trigger: "blur" }
        ],
        isRecommend: [
          { required: true, message: "是否推荐不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询官网导航栏菜单列表 */
    getList() {
      this.loading = true;
      listMenu(this.queryParams).then(response => {
        this.menuList = this.handleTree(response.data, "navId");
        // this.total = response.total;
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
        navId: undefined,
        nameCn: undefined,
        nameEn: undefined,
        parentId: undefined,
        orderNum: undefined,
        url: undefined,
        visible: undefined,
        target: undefined,
        createBy: undefined,
        createTime: undefined,
        updateBy: undefined,
        updateTime: undefined,
        remarkCn: undefined,
        remarkEn: undefined,
        level: undefined,
        code: undefined,
        seoTitleCn: undefined,
        seoTitleEn: undefined,
        seoLabelCn: undefined,
        seoLabelEn: undefined,
        seoDescribeCn: undefined,
        seoDescribeEn: undefined,
        place: "0",
        isRecommend: "0"
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
      this.ids = selection.map(item => item.navId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd(row) {
      this.reset();
      this.getTreeselect();
      if (row != null && row.navId) {
        this.form.parentId = row.navId;
      } else {
        this.form.parentId = 0;
      }
      this.open = true;
      this.title = "添加官网导航栏菜单";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.loading = true;
      this.reset();
      const navId = row.navId || this.ids
      getMenu(navId).then(response => {
        this.loading = false;
        this.form = response.data;
        this.open = true;
        this.title = "修改官网导航栏菜单";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.buttonLoading = true;
          if (this.form.navId != null) {
            updateMenu(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            }).finally(() => {
              this.buttonLoading = false;
            });
          } else {
            addMenu(this.form).then(response => {
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
      const navIds = row.navId || this.ids;
      this.$modal.confirm('是否确认删除官网导航栏菜单编号为"' + navIds + '"的数据项？').then(() => {
        this.loading = true;
        return delMenu(navIds);
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
      this.download('business/menu/export', {
        ...this.queryParams
      }, `menu_${new Date().getTime()}.xlsx`)
    },
    /** 查询菜单下拉树结构 */
    getTreeselect() {
      listMenu().then(response => {
        console.log(""+response.data)
        this.menuOptions = [];
        const menu = { navId: 0, nameCn: '主类目', children: [] };
        menu.children = this.handleTree(response.data, "navId");
        this.menuOptions.push(menu);
      });
    },
    /** 转换菜单数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.navId,
        label: node.nameCn,
        children: node.children

      };
    },
    /** 展开/折叠操作 */
    toggleExpandAll() {
      this.refreshTable = false;
      this.isExpandAll = !this.isExpandAll;
      this.$nextTick(() => {
        this.refreshTable = true;
      });
    },
  }
};
</script>
