<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--资讯类别-->
      <el-col :span="4" :xs="24">
        <div class="head-container">
          <el-input
            v-model="newstypeName"
            placeholder="请输入分类名称"
            clearable
            size="small"
            prefix-icon="el-icon-search"
            style="margin-bottom: 20px"
          />
        </div>
        <div class="head-container">
          <el-tree
            :data="newsTypeOptions"
            :props="defaultProps"
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            ref="tree"
            default-expand-all
            @node-click="handleNodeClick"
          />
        </div>
      </el-col>

      <!--资讯数据-->
      <el-col :span="20" :xs="24">
       <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="id" prop="id">
        <el-input
          v-model="queryParams.id"
          placeholder="请输入id"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="标题" prop="title">
        <el-input
          v-model="queryParams.title"
          placeholder="请输入标题"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态">
        <el-select
          v-model="queryParams.state"
          placeholder="资讯状态"
          clearable
          size="small"
          style="width: 120px"
        >
          <el-option
            v-for="item in field101Options"
            :key="item.key"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

       <el-form-item label="发布时间">
         <el-date-picker
           v-model="dateRangeCreateTime"
           size="small"
           style="width: 240px"
           value-format="yyyy-MM-dd"
           type="daterange"
           range-separator="-"
           start-placeholder="开始日期"
           end-placeholder="结束日期"
         ></el-date-picker>
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
          v-hasPermi="['community:news:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['community:news:remove']"
        >删除</el-button>
      </el-col>
         <el-col :span="1.5">

           <el-button
             v-if="this.queryParams.isDraft == 0"
             plain
             type="info"
             icon="el-icon-download"
             size="mini"
             @click="handleDraft"
             v-hasPermi="['community:news:draft']"
           >草稿箱</el-button>

           <el-button
             v-if="this.queryParams.isDraft == 1"
             type="success"
             icon="el-icon-download"
             size="mini"
             @click="handleDraft"
             v-hasPermi="['community:news:draft']"
           >返回</el-button>

         </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>


    <el-table v-loading="loading" :data="newsList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="id" align="center" prop="id" v-if="true"/>
      <el-table-column label="分类" align="center" prop="newsTypeName" />
      <el-table-column label="封面" align="center" prop="titlePic">
        <template slot-scope="scope">
          <el-image
            style="width: 80px; height: 60px"
            :src="scope.row.titlePic">
          </el-image>
        </template>
      </el-table-column>
      <el-table-column label="标题" align="center" prop="title">
        <template slot-scope="scope">
          <span v-if="scope.row.isDraft == '1'">【草稿箱】</span>
          <span>{{scope.row.title}}</span>
        </template>
      </el-table-column>
      <el-table-column label="类型" align="center" prop="type" width="100">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.cmny_new_type" :value="scope.row.type"/>
        </template>
      </el-table-column>
      <el-table-column label="发表人" align="center" prop="createName" />
      <el-table-column label="发表时间" align="center" prop="createTime" >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>

      <el-table-column label="置顶" align="center" prop="isSticky" >
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.isSticky"
            active-value="1"
            inactive-value="0"
            @change="handleStickyChange(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="首页" align="center" prop="isSite" >
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.isSite"
            active-value="1"
            inactive-value="0"
            @change="handleSiteChange(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="显示" align="center" prop="isDisplay" >
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.isDisplay"
            active-value="1"
            inactive-value="0"
            @change="handleDisplayChange(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleComment(scope.row.id)"
            v-hasPermi="['community:news:comment']"
          >查看评论</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row.id)"
            v-hasPermi="['community:news:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['community:news:remove']"
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
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {listNews, getNews, delNews, addNews, updateNews, changeStatus} from "@/api/community/news";
import { treeselect } from "@/api/community/newsType";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name: "News",
  components: { Treeselect },
  dicts: ['cmny_new_type'],
  data() {
    return {
      field101Options: [{
        key: 'isSticky',
        value: 'isSticky',
        label: '置顶'
      }, {
        key: 'isSite',
        value: 'isSite',
        label: '首页'
      }, {
        key: 'isDisplay',
        value: 'isDisplay',
        label: '显示'
      }],
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
      // 分类树选项
      newsTypeOptions: undefined,
      // 分类名称
      newstypeName: undefined,
      // 日期范围
      dateRangeCreateTime: [],
      // 总条数
      total: 0,
      // 资讯管理表格数据
      newsList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        id: undefined,
        memberId: undefined,
        lastPostedMemberId: undefined,
        categoryId: undefined,
        type: undefined,
        title: undefined,
        postedAt: undefined,
        state: undefined,
        isSticky: undefined,
        isSite: undefined,
        isDisplay: undefined,
        isDraft: 0,
        createTime:undefined,
        orderByColumn: "createTime",
        isAsc: "descending"
      },
      // 表单参数
      form: {},
      defaultProps: {
        children: "children",
        label: "label"
      },
      // 表单校验
      formData: {
        field101: [],
      },
      rules: {
        field101: [{
          required: true,
          type: 'array',
          message: '请至少选择一个field101',
          trigger: 'change'
        }],
      },

    };
  },
  watch: {
    // 根据名称筛选类别树
    newstypeName(val) {
      this.$refs.tree.filter(val);
    }
  },
  created() {
    this.getList();
    this.getTreeselect();
  },
  methods: {
    /** 查询资讯管理列表 */
    getList() {
      this.loading = true;
      listNews(this.queryParams).then(response => {
          this.newsList = response.rows;
          this.total = response.total;
          this.loading = false;
        }
      );
    },
    /** 查询分类下拉树结构 */
    getTreeselect() {
      treeselect().then(response => {
        this.newsTypeOptions = [];
        const data = { id: 0, label: 'All Categories', parentId: 0, weight: 0, children: [] };
        data.children = response.data;
        this.newsTypeOptions.push(data);
      });
    },
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    // 节点单击事件
    handleNodeClick(data) {
      this.queryParams.categoryId = data.id;
      if(data.id === 0)
      {
        this.queryParams.categoryId = null;
      }
      this.getList();
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      let value = this.queryParams.state;
      this.queryParams.isSticky = undefined;
      this.queryParams.isSite = undefined;
      this.queryParams.isDisplay = undefined;
      if(value == 'isSticky'){
        this.queryParams.isSticky = 1;
      }else if(value == 'isSite'){
        this.queryParams.isSite = 1;
      }else if(value == 'isDisplay'){
        this.queryParams.isDisplay = 1;
      }
      this.queryParams.params = {};
      if (null != this.dateRangeCreateTime && '' != this.dateRangeCreateTime) {
        this.queryParams.params["beginCreateTime"] = this.dateRangeCreateTime[0];
        this.queryParams.params["endCreateTime"] = this.dateRangeCreateTime[1];
      }
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.queryParams.state = "";
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
      this.$router.push({ path: '/news/detail'})
    },
    /** 查看评论 */
    handleComment(nid){
      this.$router.push({ path:'/news/comment', query: {news_id: nid}})
    },
    /** 修改按钮操作 */
    handleUpdate(nid) {
      this.$router.push({ path:'/news/detail', query: {news_id: nid}})
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除资讯管理编号为"' + ids + '"的数据项？').then(() => {
        this.loading = true;
        return delNews(ids);
      }).then(() => {
        this.loading = false;
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).finally(() => {
        this.loading = false;
      });
    },
    /**
     * 草稿箱切换
     */
    handleDraft(){
      this.queryParams.params = {};
      if(this.queryParams.isDraft == "1"){
        this.queryParams.isDraft = "0";
      }
      else{
        this.queryParams.isDraft = "1";
      }
      this.handleQuery();
    },
    handleStickyChange(row){
      let text = row.isSticky === "1" ? "置顶" : "取消置顶";
      this.$modal.confirm('确认要' + text + '，ID：' + row.id + '吗？').then(function() {
        return changeStatus(row.id, 'isSticky', row.isSticky);
      }).then(() => {
        this.$modal.msgSuccess(text + "成功");
      }).catch(function() {
        row.isSticky = row.isSticky === "0" ? "1" : "0";
      });
    },
    handleDraftChange(row){
      let text = row.isDraft === "1" ? "设置为草稿" : "设置为正常发布";
      this.$modal.confirm('确认要' + text + '，ID：' + row.id + '吗？').then(function() {
        return changeStatus(row.id, 'isDraft', row.isDraft);
      }).then(() => {
        this.$modal.msgSuccess(text + "成功");
      }).catch(function() {
        row.isDraft = row.isDraft === "0" ? "1" : "0";
      });
    },
    handleSiteChange(row){
      let text = row.isSite === "1" ? "首页" : "取消首页";
      this.$modal.confirm('确认要' + text + '，ID：' + row.id + '吗？').then(function() {
        return changeStatus(row.id, 'isSite', row.isSite);
      }).then(() => {
        this.$modal.msgSuccess(text + "成功");
      }).catch(function() {
        row.isSite = row.isSite === "0" ? "1" : "0";
      });
    },
    handleDisplayChange(row){
      let text = row.isDisplay === "1" ? "显示" : "隐藏";
      this.$modal.confirm('确认要' + text + '，ID：' + row.id + '吗？').then(function() {
        return changeStatus(row.id, 'isDisplay', row.isDisplay);
      }).then(() => {
        this.$modal.msgSuccess(text + "成功");
      }).catch(function() {
        row.isDisplay = row.isDisplay === "0" ? "1" : "0";
      });
    }
  }
};
</script>
