<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="分类 id" prop="id">
        <el-input
          v-model="queryParams.commId"
          placeholder="请输入分类 id"
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
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['community:gameCommunity:add']"
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
          v-hasPermi="['community:gameCommunity:remove']"
        >删除</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="gameCommunityList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="分类 id" align="center" prop="commId" v-if="true"/>
      <el-table-column label="Dapp id" align="center" prop="dappId" />
      <el-table-column label="游戏图标" align="center" prop="icon" >
        <template slot-scope="scope">
          <el-image
            style="width: 50px; height: 50px"
            :src="scope.row.icon">
          </el-image>
        </template>
      </el-table-column>
      <el-table-column label="游戏名称" align="center" prop="gameName" />
      <el-table-column label="游戏名称" align="center" prop="gameNameChinese" />
      <el-table-column label="首页" align="center" prop="property">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.property"
            active-value="1"
            inactive-value="0"
            @change="handleIndexChange(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="status">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            active-value="0"
            inactive-value="1"
            @change="handleStatusChange(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="排序" align="center" prop="sort" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
<!--          <el-button-->
<!--            size="mini"-->
<!--            type="text"-->
<!--            icon="el-icon-user-solid"-->
<!--            style="margin-right: 10px;"-->
<!--            @click="handleAllot(scope.row)"-->
<!--            v-hasPermi="['management:account:allot']"-->
<!--          >分配版主</el-button>-->
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['community:gameCommunity:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['community:gameCommunity:remove']"
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

    <!-- 添加或修改游戏分类对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="Dapp ID" prop="dappId">
          <el-input v-model="form.dappId" placeholder="Dapp ID" />
        </el-form-item>
        <el-form-item label="游戏名称" prop="gameName">
          <el-input v-model="form.gameName" placeholder="请输入游戏名称" />
        </el-form-item>
        <el-form-item label="游戏描述" prop="description">
          <el-input v-model="form.description" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="游戏名称（中文）" prop="gameNameChinese">
          <el-input v-model="form.gameNameChinese" placeholder="请输入游戏名称（中文）" />
        </el-form-item>
        <el-form-item label="游戏描述（中文）" prop="descriptionChinese">
          <el-input v-model="form.descriptionChinese" type="textarea" placeholder="请输入内容（中文）" />
        </el-form-item>
        <el-form-item label="游戏图标">
          <imageUpload v-model="form.icon"/>
        </el-form-item>
        <el-form-item label="显示顺序" prop="sort">
          <el-input v-model="form.sort" placeholder="请输入显示顺序" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :loading="buttonLoading" type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <select-user ref="select"/>
  </div>
</template>

<script>
import { listGameCommunity, getGameCommunity, delGameCommunity, addGameCommunity, updateGameCommunity, changeStatus } from "@/api/community/gameCommunity";

export default {
  name: "gameCommunity",
  data() {
    return {
      // 按钮loading
      buttonLoading: false,
      // 遮罩层
      loading: true,
      // 选中数组
      commIds: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 游戏分类表格数据
      gameCommunityList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        commId: undefined,
        dappId: undefined,
        gameName: undefined,
        description: undefined,
        icon: undefined,
        sort: undefined,
        property: undefined,
        moderators: undefined,
        parentId: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        gameName: [
          { required: true, message: "游戏名称不能为空", trigger: "blur" }
        ],
        gameNameChinese: [
          { required: true, message: "游戏名称（中文）不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询游戏分类列表 */
    getList() {
      this.loading = true;
      listGameCommunity(this.queryParams).then(response => {
        this.gameCommunityList = response.rows;
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
        dappId: undefined,
        gameName: undefined,
        description: undefined,
        gameNameChinese: undefined,
        descriptionChinese: undefined,
        icon: undefined,
        sort: undefined,
        property: undefined,
        moderators: undefined,
        createBy: undefined,
        createTime: undefined,
        updateBy: undefined,
        updateTime: undefined,
        userStatus: undefined,
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
      this.commIds = selection.map(item => item.commId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加游戏分类";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.loading = true;
      this.reset();
      const id = row.commId || this.commIds
      getGameCommunity(id).then(response => {
        this.loading = false;
        this.form = response.data;
        this.open = true;
        this.title = "修改游戏分类";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.buttonLoading = true;
          if (this.form.commId != null) {
            updateGameCommunity(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            }).finally(() => {
              this.buttonLoading = false;
            });
          } else {
            addGameCommunity(this.form).then(response => {
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
      const ids = row.commId || this.commIds;
      this.$modal.confirm('是否确认删除游戏分类编号为"' + ids + '"的数据项？').then(() => {
        this.loading = true;
        return delGameCommunity(ids);
      }).then(() => {
        this.loading = false;
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).finally(() => {
        this.loading = false;
      });
    },
    handleIndexChange(row){
      let text = row.property === "1" ? "首页" : "取消首页";
      this.$modal.confirm('确认要' + text + '，ID：' + row.commId + '吗？').then(function() {
        return changeStatus(row.commId, 'property', row.property);
      }).then(() => {
        this.$modal.msgSuccess(text + "成功");
      }).catch(function() {
        row.property = row.property === "0" ? "1" : "0";
      });
    },
    handleStatusChange(row){
      let text = row.status === "0" ? "显示" : "隐藏";
      this.$modal.confirm('确认要' + text + '，ID：' + row.commId + '吗？').then(function() {
        return changeStatus(row.commId, 'status', row.status);
      }).then(() => {
        this.$modal.msgSuccess(text + "成功");
      }).catch(function() {
        row.status = row.status === "0" ? "1" : "0";
      });
    }
  }
};
</script>
