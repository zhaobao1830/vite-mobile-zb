import { computed, nextTick, ref, watch } from 'vue'
import { getRect } from '@/core/utils/dom'

export default function usePullDown(scroll, props, emit, _calculateMinHeight) {
  const DEFAULT_REFRESH_TXT = '刷新成功'

  const pulldownWrapperRef = ref(null)

  const beforePullDown = ref(true)
  const pullDownStop = ref(40)
  const isPullingDown = ref(false)
  const pullDownStyle = ref('')
  const pullDownHeight = ref(60)
  const resetPullDownTimer = ref(null)

  const pullDownRefresh = computed(() => {
    let pullDownRefresh = props.options.pullDownRefresh
    if (!pullDownRefresh) {
      return pullDownRefresh
    }
    if (pullDownRefresh === true) {
      pullDownRefresh = {}
    }
    return Object.assign({
      stop: pullDownStop.value
    }, pullDownRefresh)
  })

  const refreshTxt = computed(() => {
    const pullDownRefreshVal = pullDownRefresh.value
    return (pullDownRefreshVal && pullDownRefreshVal.txt) || DEFAULT_REFRESH_TXT
  })

  watch(pullDownRefresh, (newVal, oldVal) => {
    if (newVal) {
      scroll.value.openPullDown(newVal)
      if (!oldVal) {
        _onPullDownRefresh()
        _pullDownRefreshChangeHandler()
      }
    }

    if (!newVal && oldVal) {
      scroll.value.closePullDown()
      _offPullDownRefresh()
      _pullDownRefreshChangeHandler()
    }
  }, {
    deep: true
  })

  function _onPullDownRefresh() {
    scroll.value.on('pullingDown', _pullDownHandle)
    scroll.value.on('scroll', _pullDownScrollHandle)
  }

  function _pullDownHandle() {
    if (resetPullDownTimer.value) {
      clearTimeout(resetPullDownTimer.value)
    }
    beforePullDown.value = false
    isPullingDown.value = true
    emit('pulling-down')
  }

  async function _pullDownRefreshChangeHandler() {
    await nextTick()
    _getPullDownEleHeight()
    _calculateMinHeight()
  }

  function _offPullDownRefresh() {
    scroll.value.off('pullingDown', _pullDownHandle)
    scroll.value.off('scroll', _pullDownScrollHandle)
  }

  function _pullDownScrollHandle(pos) {
    if (beforePullDown.value) {
      pullDownStyle.value = `top:${Math.min(pos.y - pullDownHeight.value, 0)}px`
    } else {
      pullDownStyle.value = `top:${Math.min(pos.y - pullDownStop.value, 0)}px`
    }
  }

  async function _getPullDownEleHeight() {
    const pulldownWrapper = pulldownWrapperRef.value
    if (!pulldownWrapper) {
      return
    }
    pullDownHeight.value = getRect(pulldownWrapper).height
    beforePullDown.value = false
    isPullingDown.value = true
    await nextTick()
    pullDownStop.value = getRect(pulldownWrapper).height
    beforePullDown.value = true
    isPullingDown.value = false
  }

  function _waitResetPullDown() {
    return new Promise(resolve => {
      resetPullDownTimer.value = setTimeout(() => {
        pullDownStyle.value = `top: -${pullDownHeight.value}px`
        beforePullDown.value = true
        resolve()
      }, scroll.value.options.bounceTime)
    })
  }

  return {
    pulldownWrapperRef,
    pullDownRefresh,
    refreshTxt,
    isPullingDown,
    pullDownStyle,
    beforePullDown,

    _onPullDownRefresh,
    _pullDownRefreshChangeHandler,
    _waitResetPullDown
  }
}
