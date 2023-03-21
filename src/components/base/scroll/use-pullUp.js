import { computed, nextTick, ref, watch } from 'vue'
import { getRect } from '@/core/utils/dom'

export default function usePullUp(scroll, props, emit, _calculateMinHeight) {
  const listWrapperRef = ref(null)

  const isPullUpLoad = ref(false)
  const pullUpHeight = ref(0)
  const pullUpNoMore = ref(false)

  const pullUpLoad = computed(() => {
    return props.options.pullUpLoad
  })

  const pullUpTxt = computed(() => {
    const pullUpLoadVal = pullUpLoad.value
    const txt = pullUpLoadVal && pullUpLoadVal.txt
    const moreTxt = (txt && txt.more) || ''
    const noMoreTxt = (txt && txt.noMore) || ''

    return pullUpNoMore.value ? noMoreTxt : moreTxt
  })

  watch(pullUpLoad, (newVal, oldVal) => {
    if (newVal) {
      scroll.value.openPullUp(newVal)
      if (!oldVal) {
        _onPullUpLoad()
        _pullUpLoadChangeHandler()
      }
    }

    if (!newVal && oldVal) {
      scroll.value.closePullUp()
      _offPullUpLoad()
      _pullUpLoadChangeHandler()
    }
  }, {
    deep: true
  })

  function _onPullUpLoad() {
    scroll.value.on('pullingUp', _pullUpHandle)
  }
  function _offPullUpLoad() {
    scroll.value.off('pullingUp', _pullUpHandle)
  }

  function _pullUpHandle() {
    isPullUpLoad.value = true
    emit('pulling-up')
  }

  function _pullUpLoadChangeHandler() {
    nextTick(() => {
      _getPullUpEleHeight()
      _calculateMinHeight()
    })
  }

  function _getPullUpEleHeight() {
    const listWrapper = listWrapperRef.value
    const pullup = listWrapper.nextElementSibling
    if (!pullup) {
      pullUpHeight.value = 0
      return
    }
    pullUpHeight.value = getRect(pullup).height
  }

  return {
    listWrapperRef,
    isPullUpLoad,
    pullUpLoad,
    pullUpHeight,
    pullUpNoMore,
    pullUpTxt,

    _onPullUpLoad,
    _pullUpLoadChangeHandler
  }
}
