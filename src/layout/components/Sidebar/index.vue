<template>
  <div class="sildebar_index" :class="{'has-logo':showLogo}" :style="{ backgroundColor: settings.sideTheme === 'theme-dark' ? variables.menuBackground : variables.menuLightBackground }">
    <logo v-if="showLogo" :collapse="isCollapse" style="border-top-right-radius: 21px" />
    <el-scrollbar :class="settings.sideTheme" wrap-class="scrollbar-wrapper">
      <el-menu :default-active="activeMenu" :collapse="isCollapse" :background-color="settings.sideTheme === 'theme-dark' ? variables.menuBackground : variables.menuLightBackground" :text-color="settings.sideTheme === 'theme-dark' ? variables.menuColor : variables.menuLightColor" :unique-opened="true" :active-text-color="settings.theme" :collapse-transition="false" mode="vertical">
        <sidebar-item v-for="(route, index) in sidebarRouters" :class="$store.state.app.sidebar.opened ? '' : 'iconMargin'" :key="route.path  + index" :item="route" :base-path="route.path" />
      </el-menu>
    </el-scrollbar>
    <!-- 侧边导航条拉伸开关 -->
    <div class="sildebar_btn" @click="toggleSideBar()">
      <div class="sildebar_btn_icon" :class="sidebar.opened ? 'silderOpen' : 'silderclose'"></div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import Logo from "./Logo";
import SidebarItem from "./SidebarItem";
import variables from "@/assets/styles/variables.scss";

export default {
  mounted () {
  },
  components: { SidebarItem, Logo },
  computed: {
    ...mapState(["settings"]),
    ...mapGetters(["sidebarRouters", "sidebar"]),
    activeMenu () {
      const route = this.$route;
      const { meta, path } = route;
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu;
      }
      return path;
    },
    showLogo () {
      return this.$store.state.settings.sidebarLogo;
    },
    variables () {
      return variables;
    },
    isCollapse () {
      return !this.sidebar.opened;
    }
  },
  methods: {
    toggleSideBar () {
      this.$store.dispatch('app/toggleSideBar')
    }
  }
};
</script>

<style scoped lang="scss">
.sildebar_index {
  position: relative;
  .sildebar_btn {
    cursor: pointer;
    z-index: 1000;
    width: 16px;
    position: absolute;
    top: 50%;
    right: 0;
    background: rgba(187, 190, 202, 0.41);
    border-radius: 8px;
    backdrop-filter: blur(7px);
    transform: translate(50%, -50%);
    padding: 29px 0;
    overflow: hidden;
    .sildebar_btn_icon {
      width: 24px;
      height: 24px;
      position: relative;
      left: 50%;
      transform: translateX(-50%);
    }
    .silderOpen {
      background: url('../../../assets/images/btn-left.png') no-repeat center
        100% / 100%;
      // transform: rotate(-90deg) translate(-50%, 0);
    }
    .silderclose {
      background: url('../../../assets/images/btn-right.png') no-repeat center
        100% / 100%;
      // transform: rotate(90deg) translate(-50%, 0);
    }
  }
}
/deep/ .iconMargin {
  a {
    display: block !important;
  }
  .router-link-exact-active {
    width: 100%;
    height: 52px;
  }
  .el-tooltip {
    text-align: center;
    .svg-icon {
      min-width: 24px !important;
      max-width: 24px !important;
      height: 24px;
      margin: 0 auto !important;
    }
  }
  .el-submenu__title {
    display: inline-block;
    height: 52px;
    .svg-icon {
      position: relative;
      left: 50%;
      transform: translateX(-50%);
      margin: 0 !important;
    }
  }
}
// 菜单-首页
/deep/ .el-menu-item {
  width: calc(100% - 4px);
  height: 100%;
  min-height: 52px;
  box-sizing: border-box;
  padding: 0 !important;
  padding-left: 12px !important;
  margin: 0 4px 0 0;
  border-left: solid 4px transparent;
  display: flex;
  align-items: center;
  .el-tooltip {
    position: relative !important;
  }
  .svg-icon {
    min-width: 24px !important;
    max-width: 24px !important;
    height: 24px;
    margin-right: 0 !important;
  }
  span {
    margin-left: 16px;
    // color: #ffffff;
    font-size: 14px;
    font-weight: 600;
    line-height: 27px;
  }
}
// 菜单
/deep/ .el-submenu__title {
  min-height: 52px;
  width: calc(100% - 4px);
  height: 100%;
  box-sizing: border-box;
  padding: 0 !important;
  padding-left: 12px !important;
  margin: 4px 0px;
  border-left: solid 4px transparent;
  display: flex;
  align-items: center;
  // justify-content: center;
  .svg-icon {
    min-width: 24px;
    max-width: 24px;
    height: 24px;
    margin-right: 0 !important;
  }
  span {
    margin-left: 16px;
    // color: #ffffff;
    font-size: 14px;
    font-weight: 600;
    line-height: 27px;
  }
}
</style>
