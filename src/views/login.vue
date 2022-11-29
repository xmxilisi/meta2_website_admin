<template>
  <div class="login">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form">
      <el-form-item prop="username">
        <el-input v-model="loginForm.username" type="text" auto-complete="off" placeholder="账号">
          <div slot="prepend" class="input_label user">
          </div>
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input v-model="loginForm.password" type="password" auto-complete="off" placeholder="密码" @keyup.enter.native="handleLogin">
          <div slot="prepend" class="input_label password">
          </div>
        </el-input>
      </el-form-item>
      <el-form-item prop="code" v-if="captchaOnOff">
        <el-input v-model="loginForm.code" auto-complete="off" placeholder="验证码" style="width: 274px;float:left" @keyup.enter.native="handleLogin">
          <div slot="prepend" class="input_label codeImg">
          </div>
        </el-input>
        <div class="login-code">
          <img :src="codeUrl" @click="getCode" class="login-code-img" />
        </div>
      </el-form-item>
      <div class="login_checkBox">
        <div class="login_checkBox_item" @click="loginForm.rememberMe = !loginForm.rememberMe">
          <div class="login_checkBox_icon" :class="loginForm.rememberMe ? 'login_checkBox_active' : ''"></div>
          <div>记住密码</div>
        </div>
      </div>
      <el-form-item style="width: 100%;">
        <el-button class="login_btn" :loading="loading" size="medium" type="primary" style="width: 100%;height:44px" @click.native.prevent="handleLogin">
          <span v-if="!loading">登 录</span>
          <span v-else>登 录 中...</span>
        </el-button>
        <div style="float: right" v-if="register">
          <router-link class="link-type" :to="'/register'">立即注册</router-link>
        </div>
      </el-form-item>
    </el-form>
    <!--  底部  -->
    <div class="el-login-footer">
      <!-- <span>Copyright © 2018-2021 ruoyi.vip All Rights Reserved.</span> -->
    </div>
  </div>
</template>

<script>
import { getCodeImg } from "@/api/login";
import Cookies from "js-cookie";
import { encrypt, decrypt } from "@/utils/jsencrypt";

export default {
  name: "Login",
  data () {
    return {
      codeUrl: "",
      loginForm: {
        username: "",
        password: "",
        rememberMe: false,
        code: "",
        uuid: "",
      },
      loginRules: {
        username: [
          { required: true, trigger: "blur", message: "请输入您的账号" },
        ],
        password: [
          { required: true, trigger: "blur", message: "请输入您的密码" },
        ],
        code: [{ required: true, trigger: "change", message: "请输入验证码" }],
      },
      loading: false,
      // 验证码开关
      captchaOnOff: true,
      // 注册开关
      register: false,
      redirect: undefined,
    };
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true,
    },
  },
  created () {
    this.getCode();
    this.getCookie();
  },
  methods: {
    getCode () {
      getCodeImg().then((res) => {
        this.captchaOnOff =
          res.data.captchaOnOff === undefined ? true : res.data.captchaOnOff;
        if (this.captchaOnOff) {
          this.codeUrl = "data:image/gif;base64," + res.data.img;
          this.loginForm.uuid = res.data.uuid;
        }
      });
    },
    getCookie () {
      const username = Cookies.get("username");
      const password = Cookies.get("password");
      const rememberMe = Cookies.get("rememberMe");
      this.loginForm = {
        username: username === undefined ? this.loginForm.username : username,
        password:
          password === undefined ? this.loginForm.password : decrypt(password),
        rememberMe: rememberMe === undefined ? false : Boolean(rememberMe),
      };
    },
    handleLogin () {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          if (this.loginForm.rememberMe) {
            Cookies.set("username", this.loginForm.username, { expires: 30 });
            Cookies.set("password", encrypt(this.loginForm.password), {
              expires: 30,
            });
            Cookies.set("rememberMe", this.loginForm.rememberMe, {
              expires: 30,
            });
          } else {
            Cookies.remove("username");
            Cookies.remove("password");
            Cookies.remove("rememberMe");
          }
          this.$store
            .dispatch("Login", this.loginForm)
            .then(() => {
              this.$router.push({ path: this.redirect || "/" }).catch(() => { });
            })
            .catch(() => {
              this.loading = false;
              if (this.captchaOnOff) {
                this.getCode();
              }
            });
        }
      });
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-image: url('../assets/images/login-background.jpg');
  background-size: cover;
}
.title {
  margin: 0px auto 30px auto;
  text-align: center;
  color: #707070;
}

.login-form {
  box-shadow: 0px 2px 17px 0px rgba(228, 228, 228, 0.5);
  border-radius: 16px;
  background: #ffffff;
  width: auto;
  padding: 44px 20px;
  box-sizing: border-box;
  .el-input {
    height: 44px;
    input {
      height: 44px;
    }
  }
  .input-icon {
    height: 39px;
    width: 14px;
    margin-left: 2px;
  }
}
.login-tip {
  font-size: 13px;
  text-align: center;
  color: #bfbfbf;
}
.login_checkBox {
  margin: 32px 0 48px;
  display: flex;
  font-size: 16px;
  color: #191f31;
  line-height: 22px;
  justify-content: flex-start;
  .login_checkBox_item {
    display: flex;
    align-items: center;
    cursor: pointer;
    -moz-user-select: none; /*火狐*/
    -webkit-user-select: none; /*webkit浏览器*/
    -ms-user-select: none; /*IE10*/
    -khtml-user-select: none; /*早期浏览器*/
    user-select: none;
    .login_checkBox_active {
      background: url('../assets/images/checkbox_activce.png') no-repeat center;
      background-size: 24px 24px;
      border: transparent solid 1px !important;
    }
    .login_checkBox_icon {
      width: 20px;
      height: 20px;
      box-sizing: border-box;
      border: #191f31 solid 1px;
      border-radius: 50%;
      margin-right: 12px;
    }
  }
}
.login-code {
  height: 44px;
  background: #5c5e61;
  border-radius: 16px;
  overflow: hidden;
  float: left;
  margin-left: 19px;
  img {
    cursor: pointer;
    vertical-align: middle;
  }
}
.login_btn {
  background: #191f31 !important;
  border-radius: 16px;
}
.el-login-footer {
  height: 40px;
  line-height: 40px;
  position: fixed;
  bottom: 0;
  width: 100%;
  text-align: center;
  color: #fff;
  font-family: Arial;
  font-size: 12px;
  letter-spacing: 1px;
}
.login-code-img {
  height: 44px;
}
/deep/ .el-form-item {
  padding: 0;
}
/deep/ .el-form-item--medium {
  .el-form-item__content {
    min-width: 420px !important;
    max-width: 420px !important;
    box-sizing: border-box;
    .el-input {
      &:focus-within {
        border: 1px solid #191f31;
        border-radius: 16px;
      }
      .el-input__inner {
        padding: 0;
        font-size: 14px;
        // color: #c3c7cc;
        line-height: 20px;
      }
      .el-input-group__prepend {
        margin-right: 6px;
        .input_label {
          width: 24px;
          min-width: 24px;
          max-width: 24px;
          height: 24px;
        }
        .user {
          background: url('../assets/images/user.png') no-repeat center 100% /
            100%;
        }
        .password {
          background: url('../assets/images/password.png') no-repeat center 100% /
            100%;
        }
        .codeImg {
          background: url('../assets/images/codeImg.png') no-repeat center 100% /
            100%;
        }
      }
    }
  }
}
</style>
