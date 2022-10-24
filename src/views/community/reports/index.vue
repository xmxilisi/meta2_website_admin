<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="举报 id" prop="id">
        <el-input
          v-model="queryParams.id"
          placeholder="请输入举报 id"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="状态"
          clearable
          size="small"
          style="width: 240px"
        >
          <el-option key="0" label="已处理" value="0" />
          <el-option key="1" label="未处理" value="1" />
        </el-select>
      </el-form-item>
      <el-form-item label="举报时间">
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
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['community:reports:remove']"
        >删除</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="reportsList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="举报 id" align="center" prop="id" v-if="true"/>
      <el-table-column label="用户信息" align="center">
        <template slot-scope="scope">
          <el-dropdown trigger="click">
            <span class="el-dropdown-link">
              点我查看<i class="el-icon-caret-bottom el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item class="clearfix">
                用户名：{{ scope.row.memberName }}
              </el-dropdown-item>
              <el-dropdown-item class="clearfix">
                用户昵称：{{ scope.row.memberNickname }}
              </el-dropdown-item>
              <el-dropdown-item class="clearfix">
                用户邮箱：{{ scope.row.memberEmail }}
              </el-dropdown-item>
              <el-dropdown-item class="clearfix">
                <el-image
                  style="width: 50px; height: 50px"
                  :src="scope.row.memberAvatar">
                </el-image>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
      <el-table-column label="主题信息" align="center">
        <template slot-scope="scope">
          <el-dropdown trigger="click">
              <span class="el-dropdown-link">
                点我查看<i class="el-icon-caret-bottom el-icon--right"></i>
              </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item class="clearfix">
                主题标题：{{ scope.row.threadsTitle }}
              </el-dropdown-item>
              <el-dropdown-item class="clearfix">
                主题发布人：{{ scope.row.threadsCreateBy }}
              </el-dropdown-item>
              <el-dropdown-item class="clearfix">
                主题发布时间：{{ scope.row.threadsCreateTime }}
              </el-dropdown-item>
              <el-dropdown-item class="clearfix">
                游戏分类ID：{{ scope.row.threadsgameCommunityId }}
              </el-dropdown-item>
              <el-dropdown-item class="clearfix">
                主题分类ID：{{ scope.row.threadsCategoryId }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
      <el-table-column label="回复信息" align="center">
        <template slot-scope="scope">
          <el-dropdown trigger="click">
              <span class="el-dropdown-link">
                点我查看<i class="el-icon-caret-bottom el-icon--right"></i>
              </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item class="clearfix">
                回复内容：{{ scope.row.postsContent }}
              </el-dropdown-item>
              <el-dropdown-item class="clearfix">
                回复发布人：{{ scope.row.postsCreateBy }}
              </el-dropdown-item>
              <el-dropdown-item class="clearfix">
                回复发布时间：{{ scope.row.postsCreateTime }}
              </el-dropdown-item>
              <el-dropdown-item class="clearfix">
                回复主题ID：{{ scope.row.postsThreadId }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
      <el-table-column label="分类" align="center" prop="type" >
        <template slot-scope="scope">
          <dict-tag :options="dict.type.reports_type" :value="scope.row.type"/>
        </template>
      </el-table-column>
      <el-table-column label="举报理由" align="center" prop="reason" />
      <el-table-column label="举报状态" align="center" prop="status" >
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.status === '0' ? 'success' : 'primary'"
            disable-transitions>{{scope.row.status === '1' ? '已处理' : '未处理'}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="提交用户" align="center" prop="createBy" />
      <el-table-column label="举报时间" align="center" prop="createTime" width="180">
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
            @click="handleClose(scope.row)"
            v-hasPermi="['community:reports:close']"
          > <span v-if="scope.row.status === '0'">处理</span><span v-else>回退</span></el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['community:reports:remove']"
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

  </div>
</template>

<script>
import { listReports, delReports, changeStatus } from "@/api/community/reports";
export default {
  name: "Reports",
  dicts: ['reports_type'],
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
      // 举报管理表格数据
      reportsList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 日期范围
      dateRangeCreateTime: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        id: undefined,
        memberId: undefined,
        threadId: undefined,
        postId: undefined,
        type: undefined,
        reason: undefined,
        status: undefined,
        createBy: undefined,
        createTime: undefined,
        updateBy: undefined,
        updateTime: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      }
    };
  },
  created() {
    this.getList();
    console.log(this.reportsList);
  },
  methods: {
    /** 查询举报管理列表 */
    getList() {
      this.loading = true;
      listReports(this.queryParams).then(response => {
        this.reportsList = response.rows;
        console.log(response.rows);
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
        memberId: undefined,
        threadId: undefined,
        postId: undefined,
        type: undefined,
        reason: undefined,
        status: "0",
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
    // 状态修改
    handleClose(row) {
      let text = row.status === "0" ? "处理" : "回退";
      this.$modal.confirm('确认要"' + text + '"吗？').then(function() {
        const status = row.status === "0" ? "1" : "0";
        return changeStatus(row.id, status);
      }).then(() =>{
        this.$modal.msgSuccess(text + "成功");
        this.getList();
      }).catch(function() {
        row.status = row.status === "0" ? "0" : "1";
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除举报管理编号为"' + ids + '"的数据项？').then(() => {
        this.loading = true;
        return delReports(ids);
      }).then(() => {
        this.loading = false;
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).finally(() => {
        this.loading = false;
      });
    }
  }
};
</script>
