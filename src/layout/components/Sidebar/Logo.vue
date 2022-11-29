<template>
  <div class="sidebar-logo-container" :class="{'collapse': collapse}" :style="{ backgroundColor: sideTheme === 'theme-dark' ? variables.menuBackground : variables.menuLightBackground, padding: !collapse ? '' : '0' }">
    <transition name="sidebarLogoFade">
      <router-link v-if="collapse" key="collapse" class="sidebar-logo-link collapseIcon" to="/">
        <img v-if="logo" :src="logo" class="sidebar-logo" />
        <h1 v-else class="sidebar-title" :style="{ color: sideTheme === 'theme-dark' ? variables.logoTitleColor : variables.logoLightTitleColor }">{{ title }} </h1>
      </router-link>
      <router-link v-else key="expand" class="sidebar-logo-link" to="/">
        <img v-if="logo" :src="logo" class="sidebar-logo" />
        <h1 class="sidebar-title" :style="{ color: sideTheme === 'theme-dark' ? variables.logoTitleColor : variables.logoLightTitleColor }">{{ title }} </h1>
      </router-link>
    </transition>
  </div>
</template>

<script>
import logoImg from '@/assets/logo/logo.png'
import variables from '@/assets/styles/variables.scss'

export default {
  name: 'SidebarLogo',
  props: {
    collapse: {
      type: Boolean,
      required: true
    }
  },
  computed: {
    variables () {
      return variables;
    },
    sideTheme () {
      return this.$store.state.settings.sideTheme
    }
  },
  data () {
    return {
      title: 'Meta+ 社区',
      logo: logoImg
    }
  }
}
</script>

<style lang="scss" scoped>
@font-face {
  font-family: 'word'; /* Project id  */
  src: url('../../../../public/simplified_characters.ttf');
}
.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}

.collapseIcon {
  justify-content: center;
  position: relative;
}

.sidebar-logo-container {
  position: relative;
  width: 100%;
  height: 60px;
  line-height: 60px;
  background: #191f31;
  // text-align: center;
  // text-indent: 32px;
  padding-left: 24px;
  margin-bottom: 16px;
  box-sizing: border-box;
  overflow: hidden;

  & .sidebar-logo-link {
    height: 100%;
    width: 100%;
    display: flex !important;
    align-items: center;

    & .sidebar-logo {
      width: 24px;
      height: 24px;
      vertical-align: middle;
      margin-right: 12px;
    }

    & .sidebar-title {
      font-size: 20px;
      color: #ffffff;
      line-height: 23px;
      font-family: 'word' !important;
    }
  }

  &.collapse {
    .sidebar-logo {
      margin-right: 0px;
    }
  }
}
</style>
