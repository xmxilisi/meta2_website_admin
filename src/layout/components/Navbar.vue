<template>
  <div class="navbar flex-center">
    <!-- <hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" /> -->
    <tags-view v-if="needTagsView" class="navbar-tags" />
    <!-- <breadcrumb id="breadcrumb-container" class="breadcrumb-container" v-if="!topNav" />
    <top-nav id="topmenu-container" class="topmenu-container" v-if="topNav" /> -->

    <div class="right-menu">
      <template v-if="device!=='mobile'">
        <!-- <search id="header-search" class="right-menu-item" /> -->

        <!-- <el-tooltip content="源码地址" effect="dark" placement="bottom">
          <ruo-yi-git id="ruoyi-git" class="right-menu-item hover-effect" />
        </el-tooltip>

        <el-tooltip content="文档地址" effect="dark" placement="bottom">
          <ruo-yi-doc id="ruoyi-doc" class="right-menu-item hover-effect" />
        </el-tooltip> -->

        <!-- <screenfull id="screenfull" class="right-menu-item hover-effect" /> -->

        <!-- <el-tooltip content="布局大小" effect="dark" placement="bottom">
          <size-select id="size-select" class="right-menu-item hover-effect" />
        </el-tooltip> -->
        <div class="right-time">{{time}}</div>
        <div class="right-welcome">欢迎你！</div>

      </template>

      <el-dropdown trigger="click">
        <!-- <div class="avatar-wrapper">
          <img :src="avatar" class="user-avatar">
          <i class="el-icon-caret-bottom" />
        </div> -->
        <div class="right-dropdown flex-center">
          <div class="right-dropdown-icon" :style="`background:url(${user.avatar})  no-repeat center 100% / 100%`"></div>
          <div class="right-dropdown-name">{{roleGroup}}</div>
          <div class="right-dropdown-btn"></div>
        </div>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/user/profile">
            <el-dropdown-item>个人中心</el-dropdown-item>
          </router-link>
          <el-dropdown-item @click.native="setting = true">
            <span>布局设置</span>
          </el-dropdown-item>
          <el-dropdown-item divided @click.native="logout">
            <span>退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import TagsView from './TagsView'
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import TopNav from '@/components/TopNav'
import Hamburger from '@/components/Hamburger'
import Screenfull from '@/components/Screenfull'
import SizeSelect from '@/components/SizeSelect'
import Search from '@/components/HeaderSearch'
import RuoYiGit from '@/components/RuoYi/Git'
import RuoYiDoc from '@/components/RuoYi/Doc'
import { getUserProfile } from "@/api/system/user"

export default {
  created () {
    clearInterval(this.timeId)
    this.timeId = null
    let that = this
    this.timeId = setInterval(() => {
      that.getTime()
    }, 1000)
    this.getUser()
  },
  data () {
    return {
      time: '',
      timeId: null,
      user: {},
      roleGroup: ''
    }
  },
  components: {
    Breadcrumb,
    TopNav,
    Hamburger,
    Screenfull,
    SizeSelect,
    Search,
    RuoYiGit,
    RuoYiDoc,
    TagsView
  },
  computed: {
    needTagsView () {
      return this.$store.state.settings.tagsView
    },
    ...mapGetters([
      'sidebar',
      'avatar',
      'device'
    ]),
    setting: {
      get () {
        return this.$store.state.settings.showSettings
      },
      set (val) {
        this.$store.dispatch('settings/changeSetting', {
          key: 'showSettings',
          value: val
        })
      }
    },
    topNav: {
      get () {
        return this.$store.state.settings.topNav
      }
    }
  },
  methods: {
    getUser () {
      getUserProfile().then(response => {
        this.user = response.data.user
        this.roleGroup = response.data.roleGroup
      })
    },
    getTime (timestamp = new Date().getTime()) {
      let date = new Date(timestamp)
      let year, month, day, hh, mm, ss = null
      year = date.getFullYear() + ''
      month = date.getMonth() + 1 + ''
      day = date.getDate() + ''
      hh = date.getHours() + ''
      mm = date.getMinutes() + ''
      ss = date.getSeconds() + ''
      this.time = `${year}-${month.padStart(2, 0)}-${day.padStart(2, 0)} ${hh.padStart(2, 0)}:${mm.padStart(2, 0)}:${ss.padStart(2, 0)}`
    },
    async logout () {
      this.$confirm('确定注销并退出系统吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('LogOut').then(() => {
          location.href = process.env.VUE_APP_CONTEXT_PATH + "index";
        })
      }).catch(() => { });
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  padding: 12px 12px 12px 20px;
  // box-sizing: border-box;
  // height: 50px;
  // overflow: hidden;
  position: relative;
  // box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  .navbar-tags {
    width: calc(100% - 500px);
    flex: 1 1 auto;
  }

  .breadcrumb-container {
    float: left;
  }

  .topmenu-container {
    position: absolute;
    left: 50px;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    // float: right;
    min-width: 450px;
    height: 100%;
    line-height: 50px;
    display: flex;
    align-items: center;
    margin-left: auto;
    justify-content: flex-end;
    .el-dropdown {
      // margin-left: auto;
    }
    .right-time {
      font-size: 14px;
      font-weight: 400;
      color: #5c5e61;
      line-height: 20px;
      margin-right: 28px;
    }
    .right-welcome {
      font-size: 14px;
      font-weight: 400;
      color: #9ea1a5;
      line-height: 20px;
      margin-right: 12px;
    }
    .right-dropdown {
      background: #e6e9ef;
      border-radius: 24px;
      padding: 4px;
      box-sizing: border-box;
      .right-dropdown-icon {
        min-width: 28px;
        max-width: 28px;
        height: 28px;
        border-radius: 50%;
      }
      .right-dropdown-name {
        font-weight: 400;
        line-height: 20px;
        margin: 0 16px;
        font-size: 14px;
        color: #2a2b2d;
      }
      .right-dropdown-btn {
        width: 24px;
        height: 24px;
        background: url('../../assets/images/navbar-btn.png') no-repeat center
          100% / 100%;
      }
    }
    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
