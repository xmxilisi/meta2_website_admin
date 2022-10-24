<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="发表用户" prop="memberName">
        <el-input
          v-model="queryParams.memberName"
          placeholder="请输入用户名称"
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
          v-hasPermi="['community:posts:add']"
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
          v-hasPermi="['community:posts:remove']"
        >删除</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="postsList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" align="center" prop="postId" v-if="true"/>

      <el-table-column label="内容" align="center" prop="content" width="300" >
        <template slot-scope="scope">
          <el-row>
            <el-col :span="24"><div class="grid-content bg-purple">{{ scope.row.content }}</div></el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <div class="grid-content bg-purple-light">
                <el-tooltip class="item" effect="dark" :content="scope.row.nickname" placement="bottom">
                  <el-button>{{ scope.row.memberName }}</el-button>
                </el-tooltip>
                <i class="el-icon-caret-right"></i>
                <el-tooltip class="item" effect="dark" :content="scope.row.commentNickname" placement="bottom">
                  <el-button>{{ scope.row.commentMemberName }}</el-button>
                </el-tooltip>
              </div>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column label="ip 地址" align="center" prop="ip" />
      <el-table-column label="关联回复数" align="center" prop="replyCount" />
      <el-table-column label="喜欢数" align="center" prop="likeCount" />
      <el-table-column label="是否合法" align="center" prop="isApproved" />
      <el-table-column label="发布时间" align="center" prop="createTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['community:posts:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['community:posts:remove']"
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

    <!-- 添加或修改主题回复管理对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="发表用户 id" prop="memberId">
          <el-input v-model="form.memberId" placeholder="请输入发表用户 id" />
        </el-form-item>
        <el-form-item label="关联主题 id" prop="threadId">
          <el-input v-model="form.threadId" placeholder="请输入关联主题 id" />
        </el-form-item>
        <el-form-item label="评论回复 id" prop="commentPostId">
          <el-input v-model="form.commentPostId" placeholder="请输入评论回复 id" />
        </el-form-item>
        <el-form-item label="评论回复用户 id" prop="commentMemberId">
          <el-input v-model="form.commentMemberId" placeholder="请输入评论回复用户 id" />
        </el-form-item>
        <el-form-item label="内容">
          <editor v-model="form.content" :min-height="192"/>
        </el-form-item>
        <el-form-item label="ip 地址" prop="ip">
          <el-input v-model="form.ip" placeholder="请输入ip 地址" />
        </el-form-item>
        <el-form-item label="关联回复数" prop="replyCount">
          <el-input v-model="form.replyCount" placeholder="请输入关联回复数" />
        </el-form-item>
        <el-form-item label="喜欢数" prop="likeCount">
          <el-input v-model="form.likeCount" placeholder="请输入喜欢数" />
        </el-form-item>
        <el-form-item label="删除用户 id" prop="deletedMemberId">
          <el-input v-model="form.deletedMemberId" placeholder="请输入删除用户 id" />
        </el-form-item>
        <el-form-item label="是否首个回复" prop="isFirst">
          <el-input v-model="form.isFirst" placeholder="请输入是否首个回复" />
        </el-form-item>
        <el-form-item label="是否是回复回帖的内容" prop="isComment">
          <el-input v-model="form.isComment" placeholder="请输入是否是回复回帖的内容" />
        </el-form-item>
        <el-form-item label="是否合法" prop="isApproved">
          <el-input v-model="form.isApproved" placeholder="请输入是否合法" />
        </el-form-item>
        <el-form-item label="删除时间" prop="deletedAt">
          <el-date-picker clearable size="small"
            v-model="form.deletedAt"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择删除时间">
          </el-date-picker>
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
import { listPosts, getPosts, delPosts, addPosts, updatePosts } from "@/api/community/posts";

export default {
  name: "Posts",
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
      // 主题回复管理表格数据
      postsList: [],
      // 日期范围
      dateRangeCreateTime: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        postId: this.$route.query.post_id,
        memberId: undefined,
        memberName: undefined,
        threadId: this.$route.query.thread_id,
        commentPostId: undefined,
        commentMemberId: undefined,
        content: undefined,
        ip: undefined,
        replyCount: undefined,
        likeCount: undefined,
        deletedMemberId: undefined,
        isFirst: undefined,
        isComment: undefined,
        isApproved: undefined,
        deletedAt: undefined,
        params: {
          level: 2,
        }
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        memberId: [
          { required: true, message: "发表用户 id不能为空", trigger: "blur" }
        ],
        threadId: [
          { required: true, message: "关联主题 id不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询主题回复管理列表 */
    getList() {
      this.loading = true;
      listPosts(this.queryParams).then(response => {
        this.postsList = response.rows;
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
        postId: undefined,
        memberId: undefined,
        threadId: undefined,
        commentPostId: undefined,
        commentMemberId: undefined,
        content: undefined,
        ip: undefined,
        replyCount: undefined,
        likeCount: undefined,
        deletedMemberId: undefined,
        isFirst: undefined,
        isComment: undefined,
        isApproved: undefined,
        deletedAt: undefined,
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
      this.queryParams.params = {};
      if (null != this.dateRangeCreateTime && '' != this.dateRangeCreateTime) {
        this.queryParams.params["beginCreateTime"] = this.dateRangeCreateTime[0];
        this.queryParams.params["endCreateTime"] = this.dateRangeCreateTime[1];
      }
      if (null != this.queryParams.memberName && '' != this.queryParams.memberName) {
        this.queryParams.params["memberName"] = this.queryParams.memberName;
      }
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.postId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加主题回复管理";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.loading = true;
      this.reset();
      const id = row.postId || this.ids
      getPosts(id).then(response => {
        this.loading = false;
        this.form = response.data;
        this.open = true;
        this.title = "修改主题回复管理";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.buttonLoading = true;
          if (this.form.postId != null) {
            updatePosts(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            }).finally(() => {
              this.buttonLoading = false;
            });
          } else {
            addPosts(this.form).then(response => {
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
      const ids = row.postId || this.ids;
      this.$modal.confirm('是否确认删除主题回复管理编号为"' + ids + '"的数据项？').then(() => {
        this.loading = true;
        return delPosts(ids);
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
      this.download('community/posts/export', {
        ...this.queryParams
      }, `posts_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
