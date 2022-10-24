<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="4" :xs="24">
        <!--游戏类型-->
        <div class="head-container">
          <el-input
            v-model="gameCommunityName"
            placeholder="请输入游戏类型名称"
            clearable
            size="small"
            prefix-icon="el-icon-search"
            style="margin-bottom: 20px"
          />
        </div>
        <div class="head-container">
          <el-tree
            :data="gameCommunityOptions"
            :props="defaultProps"
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            ref="tree"
            default-expand-all
            @node-click="handleNodeClick"
          />
        </div>
      </el-col>

      <!--主题数据-->
      <el-col :span="20" :xs="24">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="主题 id" prop="threadId">
        <el-input
          v-model="queryParams.threadId"
          placeholder="请输入主题 id"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="主题分类">
        <el-select
          v-model="queryParams.categoryId"
          placeholder="主题分类"
          clearable
          size="small"
        >
          <el-option
            v-for="item in cateOptions"
            :key="item.id"
            :label="item.cateName"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="用户名" prop="createBy">
        <el-input
          v-model="queryParams.createBy"
          placeholder="请输入用户名"
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
          v-hasPermi="['community:threads:add']"
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
          v-hasPermi="['community:threads:edit']"
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
          v-hasPermi="['community:threads:remove']"
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
          v-hasPermi="['community:threads:draft']"
        >草稿箱</el-button>

        <el-button
          v-if="this.queryParams.isDraft == 1"
          type="success"
          icon="el-icon-download"
          size="mini"
          @click="handleDraft"
          v-hasPermi="['community:threads:draft']"
        >返回</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="threadsList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" align="center" prop="threadId" v-if="true"/>
      <el-table-column label="游戏社区" align="center" prop="gameName" />
      <el-table-column label="主题分类" align="center" prop="cateName" />
      <el-table-column label="类型" align="center" prop="type">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.community_threads" :value="scope.row.type"/>
        </template>
      </el-table-column>
      <el-table-column label="标题" align="center" prop="title" />
      <el-table-column label="发表人" align="center" prop="createBy" />
      <el-table-column
        label="主题数据">
        <template slot-scope="scope">
          <el-dropdown trigger="click">
            <span class="el-dropdown-link">
              点我查看<i class="el-icon-caret-bottom el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item class="clearfix">
                回复
                <el-badge class="mark" :value="scope.row.postCount" />
              </el-dropdown-item>
              <el-dropdown-item class="clearfix">
                查看
                <el-badge class="mark" :value="scope.row.viewCount" />
              </el-dropdown-item>
              <el-dropdown-item class="clearfix">
                分享
                <el-badge class="mark" :value="scope.row.shareCount" />
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
      <el-table-column label="发布时间" align="center" prop="createTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
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
      <el-table-column label="加精" align="center" prop="isEssence" >
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.isEssence"
            active-value="1"
            inactive-value="0"
            @change="handleEssenceChange(scope.row)"
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
            @click="handleComment(scope.row.threadId)"
            v-hasPermi="['community:threads:comment']"
          >查看评论</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['community:threads:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['community:threads:remove']"
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

    <!-- 添加或修改主题管理对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="创建用户 id" prop="memberId">
          <el-input v-model="form.memberId" placeholder="请输入创建用户 id" />
        </el-form-item>
        <el-form-item label="最后回复用户 id" prop="lastPostedMemberId">
          <el-input v-model="form.lastPostedMemberId" placeholder="请输入最后回复用户 id" />
        </el-form-item>
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入标题" />
        </el-form-item>
        <el-form-item label="最新评论时间" prop="postedAt">
          <el-date-picker clearable size="small"
            v-model="form.postedAt"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择最新评论时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="时间记录" prop="issueAt">
          <el-date-picker clearable size="small"
            v-model="form.issueAt"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="时间记录">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :loading="buttonLoading" type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { listThreads, getThreads, delThreads, addThreads, updateThreads,changeStatus } from "@/api/community/threads";
import Treeselect from "@riophae/vue-treeselect";
import {treeselect} from "@/api/community/gameCommunity";
import {listCategories} from "@/api/community/categories";

export default {
  name: "Threads",
  components: { Treeselect },
  dicts: ['community_threads'],
  data() {
    return {
      // 按钮loading
      buttonLoading: false,
      // 遮罩层
      loading: true,
      // 选中数组
      threadIds: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 主题管理表格数据
      threadsList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      //主题下拉菜单
      cateOptions: [],
      // 主题分类树选项
      categoriesOptions: undefined,
      // 主题分类名称
      categoriesName: undefined,
      // 游戏类型树选项
      gameCommunityOptions: undefined,
      // 游戏类型名称
      gameCommunityName: undefined,
      // 日期范围
      dateRangeCreateTime: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        threadId: undefined,
        memberId: undefined,
        lastPostedMemberId: undefined,
        categoryId: undefined,
        gameCommunityId: undefined,
        type: undefined,
        title: undefined,
        postCount: undefined,
        viewCount: undefined,
        shareCount: undefined,
        postedAt: undefined,
        issueAt: undefined,
        isSticky: undefined,
        isEssence: undefined,
        isSite: undefined,
        isAnonymous: undefined,
        isDisplay: undefined,
        isDraft: undefined,
        deletedAt: undefined,
        deletedMemberId: undefined,
        createBy: undefined,
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
      rules: {
        memberId: [
          { required: true, message: "创建用户 id不能为空", trigger: "blur" }
        ],
        categoryId: [
          { required: true, message: "分类 id不能为空", trigger: "change" }
        ],
        title: [
          { required: true, message: "标题不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.queryParams.isDraft = 0;
    this.getList();
    this.getTreeselect();
    this.getCateSelect();
  },
  watch: {
    // 根据名称筛选类别树
    gameCommunityName(val) {
      this.$refs.tree.filter(val);
    },
    categoriesName(val) {
      this.$refs.tree.filter(val);
    }
  },
  methods: {
    /** 查询主题管理列表 */
    getList() {
      this.loading = true;
      listThreads(this.queryParams).then(response => {
        this.threadsList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    /** 查询分类下拉树结构 */
    getCateSelect() {
      listCategories().then(response => {
        this.cateOptions = response.rows;
      });
    },
    /** 查询分类下拉树结构 */
    getTreeselect() {
      treeselect().then(response => {
        this.gameCommunityOptions = [];
        const data = { commId: 0, label: '全部分类', parentId: 0, weight: 0, children: [] };
        data.children = response.data;
        this.gameCommunityOptions.push(data);
      });
    },
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    // 节点单击事件
    handleNodeClick(data) {
      this.queryParams.gameCommunityId = data.id;
      if(data.commId === 0)
      {
        this.queryParams.gameCommunityId = null;
      }
      this.getList();
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        memberId: undefined,
        lastPostedMemberId: undefined,
        categoryId: undefined,
        type: undefined,
        title: undefined,
        postCount: undefined,
        viewCount: undefined,
        shareCount: undefined,
        postedAt: undefined,
        issueAt: undefined,
        isSticky: "0",
        isEssence: "0",
        isSite: "0",
        isAnonymous: "0",
        isDisplay: "0",
        isDraft: "0",
        deletedAt: undefined,
        deletedMemberId: undefined,
        createBy: undefined,
        createTime: undefined,
        orderByColumn: "createTime",
        isAsc: "descending"
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.queryParams.params = {};
      if (null != this.dateRangeCreateTime && '' != this.dateRangeCreateTime) {
        this.queryParams.params["beginCreateTime"] = this.dateRangeCreateTime[0];
        this.queryParams.params["endCreateTime"] = this.dateRangeCreateTime[1];
      }
      this.getList();
    },
    /**
     * 草稿箱切换
     */
    handleDraft(){
      this.queryParams.params = {};
      //console.log(this.queryParams.isDraft);
      if(this.queryParams.isDraft == "1"){
        this.queryParams.isDraft = "0";
      }
      else{
        this.queryParams.isDraft = "1";
      }
      this.handleQuery();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.queryParams.categoryId = "";
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.threadIds = selection.map(item => item.threadId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加主题管理";
    },
    /** 查看评论 */
    handleComment(tid){
      this.$router.push({ path:'/threads/posts', query: {thread_id: tid}})
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.loading = true;
      this.reset();
      const id = row.threadId || this.threadIds
      getThreads(id).then(response => {
        this.loading = false;
        this.form = response.data;
        this.open = true;
        this.title = "修改主题管理";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.buttonLoading = true;
          if (this.form.threadId != null) {
            updateThreads(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            }).finally(() => {
              this.buttonLoading = false;
            });
          } else {
            addThreads(this.form).then(response => {
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
      const ids = row.threadId || this.threadIds;
      this.$modal.confirm('是否确认删除主题管理编号为"' + ids + '"的数据项？').then(() => {
        this.loading = true;
        return delThreads(ids);
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
      this.download('community/threads/export', {
        ...this.queryParams
      }, `threads_${new Date().getTime()}.xlsx`)
    },
    handleStickyChange(row){
      let text = row.isSticky === "1" ? "置顶" : "取消置顶";
      this.$modal.confirm('确认要' + text + '，ID：' + row.threadId + '吗？').then(function() {
        return changeStatus(row.threadId, 'isSticky', row.isSticky);
      }).then(() => {
        this.$modal.msgSuccess(text + "成功");
      }).catch(function() {
        row.isSticky = row.isSticky === "0" ? "1" : "0";
      });
    },
    handleEssenceChange(row){
      let text = row.isEssence === "1" ? "加精" : "取消加精";
      this.$modal.confirm('确认要' + text + '，ID：' + row.threadId + '吗？').then(function() {
        return changeStatus(row.threadId, 'isEssence', row.isEssence);
      }).then(() => {
        this.$modal.msgSuccess(text + "成功");
      }).catch(function() {
        row.isEssence = row.isEssence === "0" ? "1" : "0";
      });
    },
    handleSiteChange(row){
      let text = row.isSite === "1" ? "首页" : "取消首页";
      this.$modal.confirm('确认要' + text + '，ID：' + row.threadId + '吗？').then(function() {
        return changeStatus(row.threadId, 'isSite', row.isSite);
      }).then(() => {
        this.$modal.msgSuccess(text + "成功");
      }).catch(function() {
        row.isSite = row.isSite === "0" ? "1" : "0";
      });
    },
    handleDisplayChange(row){
      let text = row.isDisplay === "1" ? "显示" : "隐藏";
      this.$modal.confirm('确认要' + text + '，ID：' + row.threadId + '吗？').then(function() {
        return changeStatus(row.threadId, 'isDisplay', row.isDisplay);
      }).then(() => {
        this.$modal.msgSuccess(text + "成功");
      }).catch(function() {
        row.isDisplay = row.isDisplay === "0" ? "1" : "0";
      });
    }
  }
};
</script>
