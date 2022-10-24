<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="100px">
      <el-form-item label="DAPP ID" prop="dappId">
        <el-input
          v-model="queryParams.dappId"
          placeholder="请输入dapp id"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="游戏名称" prop="gameName">
        <el-input
          v-model="queryParams.gameName"
          placeholder="请输入游戏名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
      <el-form-item>
        <template>
          <div>
            <el-radio-group v-model="queryParams.dateGroup" @change="handleQuery">
              <el-radio-button label="Day">24小时</el-radio-button>
              <el-radio-button label="Week">7天</el-radio-button>
              <el-radio-button label="Month">30天</el-radio-button>
            </el-radio-group>
          </div>
        </template>
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
          v-hasPermi="['games:games:add']"
        >新增</el-button>
      </el-col>
<!--      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['games:games:edit']"
        >修改</el-button>
      </el-col>-->
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['games:games:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['games:games:export']"
        >导出</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-download"
          size="mini"
          @click="handleGames"
          v-loading.fullscreen.lock="fullscreenLoading"
          v-hasPermi="['games:games:games']"
        >获取游戏</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="info"
          icon="el-icon-picture-outline"
          size="mini"
          @click="handleUpadteGamesField('updateStatistic')"
          v-loading.fullscreen.lock="fullscreenLoading"
          v-hasPermi="['games:games:updateStatistic']"
        >获取统计信息</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="info"
          icon="el-icon-picture-outline"
          size="mini"
          @click="handleUpadteGamesField('updateLogo')"
          v-loading.fullscreen.lock="fullscreenLoading"
          v-hasPermi="['games:games:updateLogo']"
        >logo保存到OSS</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="info"
          icon="el-icon-link"
          size="mini"
          @click="handleUpadteGamesField('updateDeepLink')"
          v-loading.fullscreen.lock="fullscreenLoading"
          v-hasPermi="['games:games:updateDeepLink']"
        >获取真实地址</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="info"
          icon="el-icon-link"
          size="mini"
          @click="handleUpadteGamesField('saveRedis')"
          v-loading.fullscreen.lock="fullscreenLoading"
          v-hasPermi="['games:games:saveRedis']"
        >保存到Redis</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="gamesList" @selection-change="handleSelectionChange" @sort-change='handleTableChange' :default-sort="{prop: 'ranking', order: 'descending'}">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="id" align="center" prop="showId" />
      <el-table-column label="图标" align="center" prop="logo">
        <template slot-scope="scope">
          <el-image
            style="width: 50px; height: 50px"
            :src="scope.row.logo">
          </el-image>
        </template>
      </el-table-column>
      <el-table-column label="dapp id" align="center" prop="dappId" v-if="true" />
      <el-table-column label="游戏名称" align="center" prop="gameName" >
        <template slot-scope="scope">
          <span>{{scope.row.gameName}}</span>
          <el-tag v-for="ch in chain">{{ ch }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="是否新上" align="center" prop="isNew" />
      <el-table-column label="自定排名" align="center" prop="ranking" sortable="custom" :sort-orders="['ascending', 'descending']" />
      <el-table-column label="余额" align="center" prop="totalBalanceInFiat" sortable="custom" :sort-orders="['ascending', 'descending']" />
      <el-table-column label="用户" align="center" prop="userActivity" sortable="custom" :sort-orders="['ascending', 'descending']" />
      <el-table-column label="成交量" align="center" prop="totalVolumeInFiat" sortable="custom" :sort-orders="['ascending', 'descending']" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
<!--          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['games:games:edit']"
          >修改</el-button>-->
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['games:games:remove']"
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

    <!-- 添加或修改区块链游戏对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="dapp id" prop="dappId">
          <el-input v-model="form.dappId" placeholder="请输入dapp id" />
        </el-form-item>
        <el-form-item label="游戏名称" prop="gameName">
          <el-input v-model="form.gameName" placeholder="请输入游戏名称" />
        </el-form-item>
        <el-form-item label="游戏名称" prop="gameSlug">
          <el-input v-model="form.gameSlug" placeholder="请输入游戏名称" />
        </el-form-item>
        <el-form-item label="是否新上" prop="isNew">
          <el-input v-model="form.isNew" placeholder="请输入是否新上" />
        </el-form-item>
        <el-form-item label="统计信息（24小时）" prop="changes">
          <el-input v-model="form.statisticDay" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="统计信息（7天）" prop="changes">
          <el-input v-model="form.statisticWeek" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="统计信息（30天）" prop="changes">
          <el-input v-model="form.statisticMonth" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="自定排名" prop="ranking">
          <el-input v-model="form.ranking" placeholder="请输入自定排名" />
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
import { listGames, getGames, delGames, addGames, updateGames, getallgames, updateGamesField } from "@/api/games/games";

export default {
  name: "Games",
  data() {
    return {
      // 按钮loading
      buttonLoading: false,
      // 遮罩层
      loading: true,
      fullscreenLoading: false,
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
      // 区块链游戏表格数据
      gamesList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        showId: undefined,
        dappId: undefined,
        gameName: undefined,
        gameSlug: undefined,
        isNew: undefined,
        totalBalanceInFiat: undefined,
        totalVolumeInFiat: undefined,
        userActivity: undefined,
        ranking: undefined,
        dateGroup: "Day",
        orderByColumn: "ranking",
        isAsc: "descending",
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
    /** 查询区块链游戏列表 */
    getList() {
      this.loading = true;
      listGames(this.queryParams).then(response => {
        this.gamesList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    handleTableChange(val) {
      this.queryParams.isAsc = val.order;
      this.queryParams.orderByColumn = val.prop;
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
        dappId: undefined,
        gameName: undefined,
        gameSlug: undefined,
        isNew: undefined,
        ranking: undefined,
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
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.dappId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加区块链游戏";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.loading = true;
      this.reset();
      const gameId = row.dappId || this.ids
      getGames(gameId).then(response => {
        this.loading = false;
        this.form = response.data;
        this.open = true;
        this.title = "修改区块链游戏";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.buttonLoading = true;
          if (this.form.dappId != null) {
            updateGames(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            }).finally(() => {
              this.buttonLoading = false;
            });
          } else {
            addGames(this.form).then(response => {
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
      const gameIds = row.gameId || this.ids;
      this.$modal.confirm('是否确认删除区块链游戏编号为"' + gameIds + '"的数据项？').then(() => {
        this.loading = true;
        return delGames(gameIds);
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
      this.download('games/games/export', {
        ...this.queryParams
      }, `games_${new Date().getTime()}.xlsx`)
    },
    /** 获取游戏排名 */
    handleGames() {
      this.fullscreenLoading = true;
      getallgames().then(response => {
        this.fullscreenLoading = false;
        console.log(response);
        this.$modal.msgSuccess(response.data);
        this.getList();
      }).finally(() => {
        this.loading = false;
      });
    },
    /** 获取游戏排名 */
    handleUpadteGamesField(field) {
      this.fullscreenLoading = true;
      updateGamesField(field).then(response => {
        this.fullscreenLoading = false;
        console.log(response);
        this.$modal.msgSuccess(response.data);
        this.getList();
      }).finally(() => {
        this.loading = false;
      });
    }
  }
};
</script>
