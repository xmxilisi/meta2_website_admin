<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="标题" prop="titleCn">
        <el-input
          v-model="queryParams.titleCn"
          placeholder="请输入标题"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="分类" prop="type">
        <el-select v-model="queryParams.type" placeholder="请选择分类" style="width: 120px">
          <el-option
            v-for="dict in dict.type.carousel_type"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          ></el-option>
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
          v-hasPermi="['community:carousel:add']"
        >新增</el-button>
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['community:carousel:edit']"
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
          v-hasPermi="['community:carousel:remove']"
        >删除</el-button>
      </el-col> -->
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="carouselList" @selection-change="handleSelectionChange">
      <!-- <el-table-column type="selection" width="55" align="center" /> -->
      <!-- <el-table-column label="id" align="center" prop="id" v-if="true"/> -->
      <el-table-column label="标题" align="center" prop="titleCn" />
      <el-table-column label="标题英文" align="center" prop="titleEn" />
      <el-table-column label="描述" align="center" prop="descriptionCn" />
      <el-table-column label="描述英文" align="center" prop="descriptionEn" />
      <el-table-column label="描述2" align="center" prop="description2Cn" />
      <el-table-column label="描述英文2" align="center" prop="description2En" />
      <el-table-column label="图片" align="center" prop="image" width="300">
        <template slot-scope="scope">
          <div label="视频2" align="center" prop="image" width="300" v-if="isVideo(scope.row)">
            <template>
              <video :src="scope.row.image" controls="controls" style="width: 300px">
                您的浏览器不支持视频播放
              </video>
            </template>
          </div>
          <div label="图片" align="center" prop="image" width="300" v-else>
            <template >
              <el-image
                style="max-width: 50px; max-height: 50px"
                :src="scope.row.image">
              </el-image>
            </template>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="链接地址" align="center" prop="urls" />
      <el-table-column label="显示顺序" align="center" prop="sort" />
      <el-table-column label="seo标签" align="center" prop="seoLabel" />
      <el-table-column label="seo描述" align="center" prop="seoDescribe" />
      <el-table-column label="显示" align="center" prop="isSticky" >
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.isDisplay"
            active-value="1"
            inactive-value="0"
            @change="handleDisplayChange(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="分类" align="center" prop="type" >
        <template slot-scope="scope">
          <dict-tag :options="dict.type.carousel_type" :value="scope.row.type"/>
        </template>
      </el-table-column>
      <el-table-column label="时间" align="center" prop="startTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.startTime, '{y}-{m}-{d}') }} - {{ parseTime(scope.row.endTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['community:carousel:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['community:carousel:remove']"
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

    <!-- 添加或修改轮播图管理对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="标题" prop="titleCn">
          <el-input type="textarea"
          autosize v-model="form.titleCn" placeholder="请输入标题" />
        </el-form-item>
        <el-form-item label="标题英文" prop="titleEn">
          <el-input type="textarea"
          autosize v-model="form.titleEn" placeholder="请输入标题" />
        </el-form-item>
       <!-- <el-form-item label="描述" prop="description">
          <el-input v-model="form.description" type="textarea" placeholder="请输入内容" />
        </el-form-item> -->
        <el-form-item label="描述中文" prop="descriptionCn">
          <el-input type="textarea"
          autosize v-model="form.descriptionCn" placeholder="请输入描述" />
        </el-form-item>
        <el-form-item label="描述英文" prop="descriptionEn">
          <el-input type="textarea"
          autosize v-model="form.descriptionEn" placeholder="请输入描述" />
        </el-form-item>
        
        <el-form-item label="描述2中文" prop="descriptionCn">
          <el-input type="textarea"
          autosize v-model="form.description2Cn" placeholder="请输入描述" />
        </el-form-item>
        <el-form-item label="描述2英文" prop="descriptionEn">
          <el-input type="textarea"
          autosize v-model="form.description2En" placeholder="请输入描述" />
        </el-form-item>
        <el-form-item label="图片">
          <FileUpload v-model="form.image"/>
        </el-form-item>
        <el-form-item label="分类" prop="type">
          <el-select v-model="form.type" placeholder="请选择分类">
            <el-option
              v-for="dict in dict.type.carousel_type"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="链接地址" prop="urls">
          <el-input v-model="form.urls" placeholder="请输入链接地址" />
        </el-form-item>
        <el-form-item label="显示顺序" prop="sort">
          <el-input v-model="form.sort" placeholder="请输入显示顺序" />
        </el-form-item>
        <el-form-item label="显示" prop="isDisplay">
          <el-switch
            v-model="form.isDisplay"
            active-value="1"
            inactive-value="0"
          ></el-switch>
        </el-form-item>
        <el-form-item label="seo标签逗号分隔" prop="seoLabel">
          <el-input type="textarea"
          autosize v-model="form.seoLabel" placeholder="请输入seo标签" />
        </el-form-item>
        <el-form-item label="seo描述" prop="seoDescribe">
          <el-input type="textarea"
          autosize v-model="form.seoDescribe" placeholder="请输入seo标签" />
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
import { listCarousel, getCarousel, delCarousel, addCarousel, updateCarousel, changeStatus } from "@/api/community/carousel";

export default {
  name: "Carousel",
  dicts: ['carousel_type'],
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
      // 轮播图管理表格数据
      carouselList: [],
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
        titleCn: undefined,
        descriptionCn: undefined,
        image: undefined,
        urls: undefined,
        sort: undefined,
        isDisplay: undefined,
        type: undefined,
        startTime: undefined,
        endTime: undefined,
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
    /** 查询轮播图管理列表 */
    getList() {
      this.loading = true;
      listCarousel(this.queryParams).then(response => {
        this.carouselList = response.rows;
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
        titleCn: undefined,
        descriptionCn: undefined,
        image: undefined,
        urls: undefined,
        sort: undefined,
        isDisplay: undefined,
        type: undefined,
        startTime: undefined,
        endTime: undefined,
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
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加轮播图管理";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.loading = true;
      this.reset();
      const id = row.id || this.ids
      getCarousel(id).then(response => {
        this.loading = false;
        this.form = response.data;
        this.open = true;
        this.title = "修改轮播图管理";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.buttonLoading = true;
          if (this.form.id != null) {
            updateCarousel(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            }).finally(() => {
              this.buttonLoading = false;
            });
          } else {
            addCarousel(this.form).then(response => {
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
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除轮播图管理编号为"' + ids + '"的数据项？').then(() => {
        this.loading = true;
        return delCarousel(ids);
      }).then(() => {
        this.loading = false;
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).finally(() => {
        this.loading = false;
      });
    },
    handleDisplayChange(row){
      let text = row.isDisplay === "1" ? "显示" : "隐藏";
      this.$modal.confirm('确认要' + text + '，ID：' + row.id + '吗？').then(function() {
        return changeStatus(row.id, row.isDisplay);
      }).then(() => {
        this.$modal.msgSuccess(text + "成功");
      }).catch(function() {
        row.isDisplay = row.isDisplay === "0" ? "1" : "0";
      });
    },
    isVideo(row){

      if(row.image==""){
        return false;
      }
      let type = row.image.match(/^(.*)(\.)(.{1,8})$/)[3];
      //防止出问题，把获取到的所有结尾格式，全部转化为小写
      type = type.toLowerCase();
      var right_type = new Array("avi","wmv","mpg","mpeg","mov","rm","ram","swf","flv","mp4","mp3","wma","avi","rm","rmvb","flv","mpg","mkv")
      for(var i=0; i<right_type.length; i++){
        if(right_type[i] == type)
          return true;
      }
      return false;
    }
  }
};
</script>
