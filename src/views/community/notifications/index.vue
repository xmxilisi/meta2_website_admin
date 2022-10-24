<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="通知 id" prop="id">
        <el-input
          v-model="queryParams.id"
          placeholder="请输入通知 id"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="来源 ID" prop="notifiableId">
        <el-input
          v-model="queryParams.notifiableId"
          placeholder="请输入来源 ID"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="阅读时间" prop="readAt">
        <el-date-picker clearable size="small"
          v-model="queryParams.readAt"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择通知阅读时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="提交时间">
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
          v-hasPermi="['community:notifications:remove']"
        >删除</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="notificationsList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="通知 id" align="center" prop="id" v-if="true"/>
      <el-table-column label="通知类型" align="center" prop="tplsTypeName" />
      <el-table-column label="通知方式" align="center" prop="notificationTplsType" >
        <template slot-scope="scope">
          <dict-tag :options="dict.type.notificationTpls_type" :value="scope.row.notificationTplsType"/>
        </template>
      </el-table-column>
      <el-table-column label="记录 ID" align="center" prop="notificationTimingId" />
      <el-table-column label="通知内容" align="center" prop="content" />
      <el-table-column label="通知阅读时间" align="center" prop="readAt" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.readAt, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="提交时间" align="center" prop="createTime" >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['community:notifications:remove']"
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
import { listNotifications, getNotifications, delNotifications } from "@/api/community/notifications";

export default {
  name: "Notifications",
  dicts: ['notificationTpls_type'],
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
      // 系统通知管理表格数据
      notificationsList: [],
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
        memberId: undefined,
        notificationTplsId: undefined,
        notificationTplsType: undefined,
        notificationTimingId: undefined,
        content: undefined,
        readAt: undefined,
        createTime: undefined,
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
  },
  methods: {
    /** 查询系统通知管理列表 */
    getList() {
      this.loading = true;
      listNotifications(this.queryParams).then(response => {
        this.notificationsList = response.rows;
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
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除系统通知管理编号为"' + ids + '"的数据项？').then(() => {
        this.loading = true;
        return delNotifications(ids);
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
