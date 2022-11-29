<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" class="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="标识ID" prop="noticeId">
        <el-input v-model="queryParams.noticeId" placeholder="标识ID" clearable size="small" @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="用户id" prop="memberId">
        <el-input v-model="queryParams.memberId" placeholder="请输入用户id" clearable size="small" @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="通知数据" prop="data">
        <el-input v-model="queryParams.data" placeholder="请输入通知数据" clearable size="small" @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="提交时间">
        <el-date-picker v-model="dateRangeCreateTime" size="small" style="width: 240px" value-format="yyyy-MM-dd" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete" v-hasPermi="['community:notificationTiming:remove']">删除</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="notificationTimingList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="id" align="center" prop="id" v-if="true" />
      <el-table-column label="标识ID" align="center" prop="noticeId" />
      <el-table-column label="接收通知的用户id" align="center" prop="memberId" />
      <el-table-column label="通知条数" align="center" prop="number" />
      <el-table-column label="通知数据" align="center" prop="data" />
      <el-table-column label="过期时间" align="center" prop="expiredAt" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.expiredAt, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="提交时间" align="center" prop="createTime">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-hasPermi="['community:notificationTiming:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />

  </div>
</template>

<script>
import { listNotificationTiming, delNotificationTiming } from "@/api/community/notificationTiming";

export default {
  name: "NotificationTiming",
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
      // 通知发送记录表格数据
      notificationTimingList: [],
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
        id: undefined,
        noticeId: undefined,
        memberId: undefined,
        number: undefined,
        data: undefined,
        expiredAt: undefined,
        createTime: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      }
    };
  },
  created () {
    this.getList();
  },
  methods: {
    /** 查询通知发送记录列表 */
    getList () {
      this.loading = true;
      listNotificationTiming(this.queryParams).then(response => {
        this.notificationTimingList = response.rows;
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
    },
    /** 搜索按钮操作 */
    handleQuery () {
      this.queryParams.pageNum = 1;
      this.queryParams.params = {};
      if (null != this.dateRangeCreateTime && '' != this.dateRangeCreateTime) {
        this.queryParams.params["beginCreateTime"] = this.dateRangeCreateTime[0];
        this.queryParams.params["endCreateTime"] = this.dateRangeCreateTime[1];
      }
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery () {
    },
    // 多选框选中数据
    handleSelectionChange (selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 删除按钮操作 */
    handleDelete (row) {
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除通知发送记录编号为"' + ids + '"的数据项？').then(() => {
        this.loading = true;
        return delNotificationTiming(ids);
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
