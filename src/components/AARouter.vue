<template>
  <div class="aa-router">
    <transition :name="noAnim ? undefined : transitionName" appear>
      <div class="sub-view" :key="$route.path">
        <keep-alive>
          <router-view />
        </keep-alive>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { Route } from 'vue-router';

@Component
export default class AARouter extends Vue {
  public transitionName = 'slide-bottom';
  public noAnim = false;

  destroyed(): void {
    window.removeEventListener('popstate', this.popstate);
  }

  created(): void {
    if (this.$store.state.safari) {
      window.addEventListener('popstate', this.popstate);
    }

    this.$router.beforeEach((to: Route, from: Route, next) => {
      const toDepth = this.getDepth(to);
      const fromDepth = this.getDepth(from);
      const toPath = to.fullPath.split('/').slice(0, 2);
      const fromPath = from.fullPath.split('/').slice(0, 2);

      if (fromPath.join('/') !== toPath.join('/')) {
        this.transitionName = 'slide-bottom';
      } else {
        this.transitionName =
          toDepth < fromDepth ? 'slide-right' : 'slide-left';
      }

      next();
    });
  }

  public getDepth(route: Route): number {
    let path = route.fullPath;
    if (path.endsWith('/')) path = path.slice(0, -1);
    return path.split('/').length;
  }

  public popstate(): void {
    this.noAnim = true;
    setTimeout(() => {
      this.noAnim = false;
    }, 500);
  }
}
</script>

<style lang="scss" scoped>
.slide-left-leave-active,
.slide-right-enter-active,
.slide-bottom-leave-active {
  z-index: 60;
}
.slide-left-enter-active,
.slide-right-leave-active,
.slide-bottom-enter-active {
  z-index: 80;
}

.slide-left-enter,
.slide-right-leave-to {
  transform: translate(100%, 0);
}
.slide-left-leave-to,
.slide-right-enter {
  transform: translate(-200px, 0);
}

.slide-bottom-enter {
  opacity: 0;
  transform: translate(0, 500px);
}
.slide-bottom-leave-to {
  opacity: 0;
  transform: translate(0, -200px);
}

.slide-bottom-enter-active,
.slide-bottom-leave-active,
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
}

.aa-router {
  position: relative;
  max-width: 100vw;
  z-index: 50;

  .sub-view {
    top: 0;

    @media #{$isDesktop} {
      left: $sidebar-width;
    }
    @media #{$isMobile} {
      left: 0;
    }

    right: 0;
    position: absolute;
    height: 100vh;
    background: rgba(var(--vm-paragraph), 1);
  }
}
</style>
