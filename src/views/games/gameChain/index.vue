<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="链简称" prop="chainName">
        <el-input
          v-model="queryParams.chainName"
          placeholder="请输入链简称"
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
          v-hasPermi="['games:gameChain:add']"
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
          v-hasPermi="['games:gameChain:remove']"
        >删除</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="gameChainList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="id" align="center" prop="chainId" v-if="true"/>
      <el-table-column label="链简称" align="center" prop="chainName" />
      <el-table-column label="链全称" align="center" prop="chainSymbol" />
      <el-table-column label="链标识" align="center" prop="chainShortSymbol" />
      <el-table-column label="链图标" align="center" prop="chainIcon" >
        <template slot-scope="scope">
          <el-image
            style="width: 50px; height: 50px"
            :src="scope.row.chainIcon">
          </el-image>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="isNew">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.isNew == 1">NEW</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="顺序" align="center" prop="sort" />
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
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['games:gameChain:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['games:gameChain:remove']"
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

    <!-- 添加或修改区块链管理对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="链简称" prop="chainName">
          <el-input v-model="form.chainName" placeholder="请输入区块链名称" />
        </el-form-item>
        <el-form-item label="链全称" prop="chainSymbol">
          <el-input v-model="form.chainSymbol" placeholder="请输入区块链标识" />
        </el-form-item>
        <el-form-item label="链标识" prop="chainShortSymbol">
          <el-input v-model="form.chainShortSymbol" placeholder="请输入区块链短标识" />
        </el-form-item>
        <el-form-item label="链图标">
          <imageUpload v-model="form.chainIcon"/>
        </el-form-item>
        <el-form-item label="新上" prop="isNew">
          <template>
            <el-checkbox v-model="form.isNew" true-label="1" false-label="0">是</el-checkbox>
          </template>
        </el-form-item>
        <el-form-item label="顺序" prop="sort">
          <el-input v-model="form.sort" placeholder="请输入显示顺序" />
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
import { listGameChain, getGameChain, delGameChain, addGameChain, updateGameChain, changeStatus } from "@/api/games/gameChain";

export default {
  name: "GameChain",
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
      // 区块链管理表格数据
      gameChainList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        chainId: undefined,
        chainName: undefined,
        chainSymbol: undefined,
        chainShortSymbol: undefined,
        chainIcon: undefined,
        isNew: undefined,
        sort: undefined,
        status: undefined,
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
    /** 查询区块链管理列表 */
    getList() {
      this.loading = true;
      listGameChain(this.queryParams).then(response => {
        this.gameChainList = response.rows;
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
        chainId: undefined,
        chainName: undefined,
        chainSymbol: undefined,
        chainShortSymbol: undefined,
        chainIcon: undefined,
        isNew: undefined,
        sort: undefined,
        status: "0",
        createBy: undefined,
        createTime: undefined,
        updateBy: undefined,
        updateTime: undefined,
        delFlag: undefined
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
      this.ids = selection.map(item => item.chainId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加区块链管理";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.loading = true;
      this.reset();
      const chainId = row.chainId || this.ids
      getGameChain(chainId).then(response => {
        this.loading = false;
        this.form = response.data;
        this.open = true;
        this.title = "修改区块链管理";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.buttonLoading = true;
          if (this.form.chainId != null) {
            updateGameChain(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            }).finally(() => {
              this.buttonLoading = false;
            });
          } else {
            addGameChain(this.form).then(response => {
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
      const chainIds = row.chainId || this.ids;
      this.$modal.confirm('是否确认删除区块链管理编号为"' + chainIds + '"的数据项？').then(() => {
        this.loading = true;
        return delGameChain(chainIds);
      }).then(() => {
        this.loading = false;
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).finally(() => {
        this.loading = false;
      });
    },
    handleStatusChange(row){
      let text = row.status === "1" ? "显示" : "隐藏";
      this.$modal.confirm('确认要' + text + '，ID：' + row.chainId + '吗？').then(function() {
        const data = {
          chainId: row.chainId,
          status: row.status
        }
        updateGameChain(data).then(response => {
          this.$modal.msgSuccess("修改成功");
          this.getList();
        }).finally(() => {
          this.$modal.msgSuccess("修改失败");
        });
      }).catch(function() {
        row.status = row.status === "0" ? "1" : "0";
      });
    }
  }
};
</script>
