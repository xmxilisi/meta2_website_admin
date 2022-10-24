<template>
  <div style="margin:30px;">
    <el-form ref="elForm" :model="formData" :rules="rules" size="medium" label-width="100px">
      <el-form-item label="资讯标题" prop="title">
        <el-input v-model="formData.title" placeholder="请输入资讯标题" :style="{width: '100%'}"></el-input>
      </el-form-item>
      <el-form-item label="资讯分类" prop="categoryId">
        <el-cascader v-model="formData.categoryId" :options="categoryIdOptions" :props="categoryIdProps"
                     :style="{width: '100%'}" placeholder="请选择资讯分类" separator=" / " clearable @change="handleChange"></el-cascader>
      </el-form-item>
      <el-form-item label="资讯内容" prop="content">
        <editor v-model="formData.content" :min-height="192"/>
      </el-form-item>
      <el-form-item label="标题图片" prop="titlePic">
        <imageUpload v-model="formData.titlePic" fileSize="2" />
      </el-form-item>
      <el-form-item label="资讯类型" prop="type">
        <el-select v-model="formData.type" placeholder="请选择资讯类型" :style="{width: '100%'}">
          <el-option v-for="(item, index) in typeOptions" :key="index" :label="item.label" :value="item.value"
                     :disabled="item.disabled"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="发布时间" prop="newsTime">
        <el-date-picker type="datetime" v-model="formData.newsTime" format="yyyy-MM-dd HH:mm:ss"
                        value-format="yyyy-MM-dd HH:mm:ss" :style="{width: '100%'}" placeholder="请选择发布时间"></el-date-picker>
      </el-form-item>
      <el-form-item size="large">
        <el-button type="primary" @click="submitForm(0)">提交</el-button>
        <el-button type="primary" plain @click="submitForm(1)">保存为草稿</el-button>
        <el-button type="danger" @click="resetForm">重置</el-button>
        <el-button type="danger" plain @click="closeForm">关闭</el-button>

      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import {addNewsChinese, getNewsChinese, updateNewsChinese} from "@/api/community/newsChinese";
import {listNewsType, treeselectChinese} from "@/api/community/newsType";

export default {
  components: {},
  props: [],
  data() {
    return {
      form: {},
      formData: {
        title: '',
        categoryId: [0],
        content: undefined,
        titlePic: null,
        type: 0,
        isDraft: 0,
        newsTime: '',
      },
      rules: {
        title: [{
          required: true,
          message: '请输入资讯标题',
          trigger: 'blur'
        }],
        categoryId: [{
          required: true,
          type: 'array',
          message: '请至少选择一个categoryId',
          trigger: 'change'
        }],
        content: [{
          required: true,
          message: '请输入资讯内容',
          trigger: 'blur'
        }],
        type: [],
        newsTime: [],
      },
      categoryIdOptions: [],
      typeOptions: [{
        "label": "普通",
        "value": 0
      }, {
        "label": "长文",
        "value": 1
      }, {
        "label": "视频",
        "value": 2
      }, {
        "label": "图片",
        "value": 3
      }],
      categoryIdProps: {
        children: "children",
        label: "label",
        value: "id",
      },
    }
  },
  computed: {},
  watch: {},
  created() {
    this.getTreeselect();
    if(this.$route.query.news_id){
      document.title = '修改资讯';
      getNewsChinese(this.$route.query.news_id).then(response => {
        //查询级联分类
        let det = this.changeDetSelect(response.data.categoryId, this.categoryIdOptions)
        response.data.categoryId = det;
        this.formData = response.data;
      });
    }
    else {
      this.getCurrentTime();
    }

  },
  mounted() {},
  methods: {
    resetForm() {
      this.$refs['elForm'].resetFields()
    },
    //回显(多级)
    changeDetSelect(key, treeData) {
      let arr = []; // 在递归时操作的数组
      let returnArr = []; // 存放结果的数组
      let depth = 0; // 定义全局层级
      // 定义递归函数
      function childrenEach(childrenData, depthN) {
        for (var j = 0; j < childrenData.length; j++) {
          depth = depthN; // 将执行的层级赋值 到 全局层级
          arr[depthN] = childrenData[j].id;
          if (childrenData[j].id== key) {
            returnArr = arr.slice(0, depthN + 1); //将目前匹配的数组，截断并保存到结果数组，
            break;
          } else {
            if (childrenData[j].children) {
              depth++;
              childrenEach(childrenData[j].children, depth);
            }
          }
        }
        return returnArr;
      }
      return childrenEach(treeData, depth);
    },
    handleChange(value) {
      let cate = Object.keys(value).map(key => {
        return value[key];
      });
      this.form.categoryId = cate[cate.length-1];
    },
    /**
     * 获取当前时间
     */
    getCurrentTime() {
      //获取当前时间
      this.formData.newsTime = new Date();
    },
    /** 查询分类下拉树结构 */
    getTreeselect() {
      treeselectChinese().then(response => {
        this.categoryIdOptions = response.data;
      });
    },
    /** 提交按钮 */
    submitForm(draft) {
      this.$refs["elForm"].validate(valid => {
        this.form.id = this.formData.id;
        this.form.title = this.formData.title;
        this.form.content = this.formData.content;
        this.form.titlePic = this.formData.titlePic;
        this.form.type = this.formData.type;
        this.form.newsTime = new Date(this.formData.newsTime).getTime();
        this.form.isDraft = 0;
        if(draft == 1)
        {
          this.form.isDraft = 1;
        }
        if (valid) {
          this.buttonLoading = true;
          if (this.form.id != null) {
            updateNewsChinese(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.closeForm();
            }).finally(() => {
              this.buttonLoading = false;
            });
          } else {
            addNewsChinese(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.closeForm();
            }).finally(() => {
              this.buttonLoading = false;
            });
          }
        }
      });
    },
    /** 关闭按钮 */
    closeForm() {
      const obj = { path: "/news/newsChinese" };
      this.$tab.refreshPage(obj);
      this.$tab.closeOpenPage(obj);
    },
  }
}

</script>
<style>
.el-upload__tip {
  line-height: 1.2;
}

</style>
