<template>
    <div>
        <div class="todo-app__actions">
            <div class="filters">
                <router-link
                    to="all"
                    tag="button">
                    모든 항목({{ total }})
                </router-link>
                <router-link
                    to="active"
                    tag="button">
                    해야 할 항목({{ activeCount }})
                </router-link>
                <router-link
                    to="completed"
                    tag="button">
                    완료 된 항목({{ completedCount }})
                </router-link>
            </div>

            <div class="actions clearfix">
                <div class="float--left">
                    <label>
                        <input
                            v-model="allDone"
                            type="checkbox" />
                        <span class="icon">
                            <i class="material-icons">done_all</i>
                        </span>
                    </label>
                </div>
                <div class="float--right clearfix">
                    <button
                        class="btn float--left"
                        @click="scrollTop">
                        <i class="material-icons">expand_less</i>
                    </button>
                    <button class="btn float--left"
                        @click="scrollBottom">
                        <i class="material-icons">expand_more</i>
                    </button>
                    <button
                        class="btn btn--danger float--left"
                        @click="clearCompleted">
                            <i class="material-icons">delete_sweep</i>
                    </button>
                </div>
            </div>
        </div>

        <div class="todo-app__list">
            <todo-item
                v-for="todo in filteredTodos"
                :key="todo.id"
                :todo="todo" />
            <todo-creator class="todo-app__creator" />
        </div>
    </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import scrollTo from 'scroll-to'
import TodoItem from '~/components/TodoItem'
import TodoCreator from '~/components/TodoCreator'

export default {
  components: {
    TodoItem,
    TodoCreator
  },
  computed: {
    // Helpers
    ...mapState('todoApp', [
      'todos'
    ]),
    ...mapGetters('todoApp', [
      'filteredTodos',
      'total',
      'activeCount',
      'completedCount'
    ]),
    allDone: {
      // 항목을 직접 클릭할 경우
      get () {
        return this.total === this.completedCount && this.total > 0
      },
      // 전체 체크를 클릭할 경우
      set (checked) {
        this.completeAll(checked)
      }
    }
  },
  watch: {
    $route () {
      // this.$store.commit('todoApp/updateFilter', this.$route.params.id)
      this.updateFilter(this.$route.params.id)
    }
  },
  created () {
    this.initDB()
  },
  methods: {
    ...mapMutations('todoApp', [
      'updateFilter'
    ]),
    ...mapActions('todoApp', [
      'initDB',
      'completeAll',
      'clearCompleted'
    ]),
    scrollTop () {
      scrollTo(0, 0, {
        ease: 'linear',
        duration: 1000
      })
    },
    scrollBottom () {
      scrollTo(0, document.body.scrollHeight, {
        ease: 'linear',
        duration: 1000
      })
    }
  }
}
</script>

<style lang="scss">
    // 절대경로 사용, scss
    @import "scss/style";

    .filters button.router-link-active {
        background: royalblue;
        color: white;
    }
</style>
