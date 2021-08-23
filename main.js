import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'

new Vue({
  el: '#app',
  router: router,
  store: store,
  // 같은의미 h = createElement / 화살표 함수
  render: h => h(App)

  // render (createElement) {
  //     return createElement(App)
  // }
})
