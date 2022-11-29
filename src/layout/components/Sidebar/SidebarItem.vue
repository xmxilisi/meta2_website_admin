<template>
  <div v-if="!item.hidden">
    <!-- 没有子级 -->
    <template v-if="hasOneShowingChild(item.children,item) && (!onlyOneChild.children||onlyOneChild.noShowingChildren)&&!item.alwaysShow">
      <app-link v-if="onlyOneChild.meta" :to="resolvePath(onlyOneChild.path, onlyOneChild.query)">
        <el-menu-item :index="resolvePath(onlyOneChild.path)" :class="[{'submenu-title-noDropdown':!isNest}, resUrlClass(onlyOneChild.path)]">
          <item :icon="onlyOneChild.meta.icon||(item.meta&&item.meta.icon)" :title="onlyOneChild.meta.title" />
        </el-menu-item>
      </app-link>
    </template>
    <!-- 有子级 -->
    <el-submenu v-else ref="subMenu" :index="resolvePath(item.path)" popper-append-to-body>
      <template slot="title">
        <item v-if="item.meta" :icon="item.meta && item.meta.icon" :title="item.meta.title" :class="resUrlClass(item.path)" />
      </template>
      <sidebar-item v-for="child in item.children" :key="child.path" :is-nest="true" :item="child" :base-path="resolvePath(child.path)" class="nest-menu" />
    </el-submenu>
  </div>
</template>

<script>
import path from 'path'
import { isExternal } from '@/utils/validate'
import Item from './Item'
import AppLink from './Link'
import FixiOSBug from './FixiOSBug'

export default {
  name: 'SidebarItem',
  components: { Item, AppLink },
  mixins: [FixiOSBug],
  props: {
    // route object
    item: {
      type: Object,
      required: true
    },
    isNest: {
      type: Boolean,
      default: false
    },
    basePath: {
      type: String,
      default: ''
    }
  },
  data () {
    this.onlyOneChild = null
    return {
      // 路由地址
      urlArr: []
    }
  },
  computed: {
  },
  watch: {
  },
  methods: {
    // 返回当前选择的路由
    resUrlClass (path) {
      if (path === '') {
        return
      }
      if (this.$route.fullPath.indexOf(path) != -1) {
        if (path.split('/').length === 1) {
          return 'sildebarActive'
        } else {
          return ''
        }
      }
    },
    hasOneShowingChild (children = [], parent) {
      if (!children) {
        children = [];
      }
      const showingChildren = children.filter(item => {
        if (item.hidden) {
          return false
        } else {
          // Temp set(will be used if only has one showing child)
          this.onlyOneChild = item
          return true
        }
      })

      // When there is only one child router, the child router is displayed by default
      if (showingChildren.length === 1) {
        return true
      }

      // Show parent if there are no child router to display
      if (showingChildren.length === 0) {
        this.onlyOneChild = { ...parent, path: '', noShowingChildren: true }
        return true
      }

      return false
    },
    resolvePath (routePath, routeQuery) {
      if (isExternal(routePath)) {
        return routePath
      }
      if (isExternal(this.basePath)) {
        return this.basePath
      }
      if (routeQuery) {
        let query = JSON.parse(routeQuery);
        return { path: path.resolve(this.basePath, routePath), query: query }
      }
      return path.resolve(this.basePath, routePath)
    }
  }
}
</script>

<style scoped lang="scss">
.sildebarActive {
  margin: 0 4px 0 0;
  border-left: solid 4px #ffffff !important;
  background: rgba($color: #ffffff, $alpha: 0.1) !important;
  border-radius: 0px 16px 16px 0px;
  color: #ffffff !important;
}
/deep/ .el-menu--vertical .nest-menu,
/deep/ .nest-menu {
  width: 96%;
  margin: 0 auto;
  background: #191f31;
  padding: 4px;
  box-sizing: border-box;
  a {
    overflow: inherit;
    .el-menu-item {
      &:hover {
        background: rgba($color: #ffffff, $alpha: 0.1) !important;
      }
      background: #191f31 !important;
      border-radius: 8px;
      border: 0;
    }
  }
}
#app .sidebar-container .nest-menu .el-submenu > .el-submenu__title,
#app .sidebar-container .el-submenu .el-menu-item {
  min-width: 100% !important;
}
#app .sidebar-container .theme-dark .el-submenu {
  .el-menu-item {
    background: #191f31 !important;
  }
  .is-active {
    background: rgba($color: #ffffff, $alpha: 0.1) !important;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    color: #ffffff !important;
    line-height: 20px;
  }
}
/deep/ .is-active > .el-submenu__title {
  margin: 0 4px 0 0;
  border-left: solid 4px #ffffff !important;
  background: rgba($color: #ffffff, $alpha: 0.1) !important;
  border-radius: 0px 16px 16px 0px;
  color: #ffffff !important;
}
.nest-menu /deep/ .is-active > .el-submenu__title,
.nest-menu /deep/ .is-active {
  background: rgba($color: #ffffff, $alpha: 0.1) !important;
  border-radius: 8px !important;
  border: 0 !important;
  color: #ffffff !important;
  // width: 96%;
  margin: 0 auto;
}
.nest-menu /deep/ .is-active {
  width: 96%;
}
</style>
