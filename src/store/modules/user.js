import { defineStore } from 'pinia'

export const useUserStore = defineStore({
  id: 'app-user',
  state: () => ({
    userInfo: {}
  }),
  getters: {
    getUserInfo() {
      return this.userInfo
    }
  },
  actions: {
    setUserInfo(info) {
      this.userInfo = info
    }
  }
})
