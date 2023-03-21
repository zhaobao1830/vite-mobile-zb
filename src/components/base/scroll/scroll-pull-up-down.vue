<template>
  <div
    ref="scrollWrapperRef"
    class="scroll-pull-up-down"
  >
    <div class="scroll-pull-up-down-content">
      <div ref="listWrapperRef" class="scroll-list-wrapper">
        <slot>
        </slot>
      </div>
      <slot name="pullup" :pullUpLoad="pullUpLoad" :isPullUpLoad="isPullUpLoad">
        <div class="scroll-pullup-wrapper" v-if="pullUpLoad && data.length > 0">
          <div class="before-trigger" v-if="!isPullUpLoad">
            <span>{{pullUpTxt}}</span>
          </div>
          <div class="after-trigger" v-else>
            <span class="pullup-txt">加载中...</span>
          </div>
        </div>
      </slot>
    </div>
    <div
      v-if="pullDownRefresh"
      class="scroll-pulldown"
      >
      <slot
        name="pulldown"
        :pullDownRefresh="pullDownRefresh"
        :pullDownStyle="pullDownStyle"
        :beforePullDown="beforePullDown"
        :isPullingDown="isPullingDown"
      >
        <div class="scroll-pulldown-wrapper" ref="pulldownWrapperRef" :style="pullDownStyle">
          <div class="before-trigger" v-show="beforePullDown">
            <van-icon name="down"/>
          </div>
          <div class="after-trigger" v-show="!beforePullDown">
            <div v-show="isPullingDown" class="loading">
              <span>刷新中...</span>
            </div>
            <div v-show="!isPullingDown" class="scroll-pulldown-loaded">
              <span>{{refreshTxt}}</span>
            </div>
          </div>
        </div>
      </slot>
    </div>
  </div>
</template>

<script setup>
  import { nextTick, onMounted, ref, watch, onActivated, onDeactivated } from 'vue'
  import usePullDown from './use-pullDown'
  import usePullUp from './use-pullUp'
  import BScroll from '@better-scroll/core'
  import PullDown from '@better-scroll/pull-down'
  import PullUp from '@better-scroll/pull-up'
  import { getRect } from '@/core/utils/dom'
  import { USE_TRANSITION } from '@/core/bscroll/constants'

  BScroll.use(PullDown)
  BScroll.use(PullUp)

  const DEFAULT_STOP_TIME = 600

  const props = defineProps({
    data: {
      type: Array,
      default() {
        return []
      }
    },
    options: {
      type: Object,
      default() {
        return {}
      }
    },
    refreshDelay: {
      type: Number,
      default: 20
    }
  })

  const isPullDownUpdating = ref(false)

  const scroll = ref(null)

  const scrollWrapperRef = ref(null)

  const emit = defineEmits(['pulling-down', 'pulling-up'])

  const {
    pulldownWrapperRef,
    pullDownRefresh,
    refreshTxt,
    isPullingDown,
    pullDownStyle,
    beforePullDown,

    _onPullDownRefresh,
    _pullDownRefreshChangeHandler,
    _waitResetPullDown
  } = usePullDown(scroll, props, emit, _calculateMinHeight)

  const {
    listWrapperRef,
    isPullUpLoad,
    pullUpLoad,
    pullUpHeight,
    pullUpTxt,
    pullUpNoMore,

    _onPullUpLoad,
    _pullUpLoadChangeHandler
  } = usePullUp(scroll, props, emit, _calculateMinHeight)

  onMounted(async () => {
    await nextTick()
    initBscroll()
  })

  // setup内部的资源是私有的 使用defineExpose可以将资源显示暴露 供父组件调用
  defineExpose({
    forceUpdate
  })

  watch(() => props.data, () => {
    setTimeout(() => {
      forceUpdate(true)
    }, props.refreshDelay)
  })

  onActivated(() => {
    enable()
  })

  onDeactivated(() => {
    disable()
  })

  function initBscroll() {
    if (!scrollWrapperRef.value) {
      return
    }
    _calculateMinHeight()
    const dynamicOptions = {
      scrollY: true,
      click: true,
      probeType: 1,
      useTransition: USE_TRANSITION
    }
    const options = Object.assign({}, dynamicOptions, props.options)
    scroll.value = new BScroll(scrollWrapperRef.value, options)

    if (pullDownRefresh.value) {
      _onPullDownRefresh()
      _pullDownRefreshChangeHandler()
    }

    if (pullUpLoad.value) {
      _onPullUpLoad()
      _pullUpLoadChangeHandler()
    }
  }

  function _calculateMinHeight() {
    const pullUpLoadVal = pullUpLoad.value
    const pullDownRefreshVal = pullDownRefresh.value
    let minHeight = 0
    if (pullDownRefreshVal || pullUpLoadVal) {
      const wrapperHeight = getRect(scrollWrapperRef.value).height
      minHeight = wrapperHeight + 1
      if (pullUpLoadVal && pullUpLoadVal.visible) {
        minHeight -= pullUpHeight.value
      }
    }
    listWrapperRef.value.style.minHeight = `${minHeight}px`
  }

  async function forceUpdate(dirty = false, nomore = false) {
    if (isPullDownUpdating.value) {
      return
    }
    if (pullDownRefresh.value && isPullingDown.value) {
      isPullingDown.value = false
      isPullDownUpdating.value = true
      await _waitFinishPullDown()
      isPullDownUpdating.value = false
      await _waitResetPullDown(dirty)
    } else if (pullUpLoad.value && isPullUpLoad.value) {
      isPullUpLoad.value = false
      scroll.value.finishPullUp()
      pullUpNoMore.value = !dirty || nomore
    }

    dirty && refresh()
  }

  function _waitFinishPullDown() {
    const { stopTime = DEFAULT_STOP_TIME } = pullDownRefresh.value
    return new Promise(resolve => {
      setTimeout(() => {
        scroll.value.finishPullDown()
        resolve()
      }, stopTime)
    })
  }

  function disable() {
    scroll.value && scroll.value.disable()
  }

  function enable() {
    scroll.value && scroll.value.enable()
  }

  function refresh() {
    _calculateMinHeight()
    scroll.value && scroll.value.refresh()
  }
</script>

<style scoped lang="scss">
  .scroll-pull-up-down{
    position: relative;
    height: 100%;
    overflow: hidden;
    .scroll-pull-up-down-content{
      position: relative;
      z-index: 1;
      .scroll-list-wrapper{
        overflow: hidden;
      }
      .scroll-pullup-wrapper{
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        .before-trigger{
          padding: 22px 0;
          min-height: 1em;
        }
        .after-trigger{
          padding: 19px 0;
        }
      }
    }
    .scroll-pulldown{
      .scroll-pulldown-wrapper{
        position: absolute;
        width: 100%;
        left: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        transition: all;
        overflow: hidden;
        .before-trigger{
          height: 54px;
          line-height: 0;
          padding-top: 6px
        }
        .after-trigger{
          .loading {
            padding: 8px 0;
            font-size: 14px;
          }
          .scroll-pulldown-loaded{
            padding: 8px 0;
            font-size: 14px;
          }
        }
      }
    }
  }
</style>
