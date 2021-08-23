import Vue from 'vue'
import lowdb from 'lowdb'
import LocalStorage from 'lowdb/adapters/LocalStorage'
// import cryptoRandomString from 'crypto-random-string'
import _find from 'lodash/find'
import _assign from 'lodash/assign'
import _cloneDeep from 'lodash/cloneDeep'
import _findIndex from 'lodash/findIndex'
import _forEachRight from 'lodash/forEachRight'

export default {
  namespaced: true,
  // data
  // 함수로 선언
  state: () => {
    return {
      db: null,
      todos: [],
      filter: 'all'
    }
  },
  // computed
  getters: {
    filteredTodos (state) {
      switch (state.filter) {
        case 'all':
        default:
          return state.todos
        case 'active':
          return state.todos.filter(todo => !todo.done)
        case 'completed':
          return state.todos.filter(todo => todo.done)
      }
    },
    total (state) {
      return state.todos.length
    },
    activeCount (state) {
      return state.todos.filter(todo => !todo.done).length
    },
    completedCount (state, getters) {
      return getters.total - getters.activeCount
    }
  },
  // methods
  // 실제 값을 변경할 때 (비동기 x)
  mutations: {
    assignDB (state, db) {
      state.db = db
    },
    createDB (state, newTodo) {
      state.db.get('todos').push(newTodo).write()
    },
    updateDB (state, { todo, value }) {
      state.db.get('todos').find({ id: todo.id }).assign(value).write()
    },
    deleteDB (state, todo) {
      state.db.get('todos').remove({ id: todo.id }).write()
    },
    assignTodos (state, todos) {
      state.todos = todos
    },
    pushTodo (state, newTodo) {
      state.todos.push(newTodo)
    },
    assignTodo (state, { foundTodo, value }) {
      _assign(foundTodo, value)
    },
    deleteTodo (state, foundIndex) {
      Vue.delete(state.todos, foundIndex)
    },
    updateTodo (state, { todo, key, value }) {
      todo[key] = value
    },
    updateFilter (state, filter) {
      state.filter = filter
    }
  },
  // methods
  // 일반 로직 (비동기 o)
  actions: {
    initDB (context) {
      const { state } = context
      const { commit } = context
      const adapter = new LocalStorage('todo-app')
      // state.db = lowdb(adapter)
      commit('assignDB', lowdb(adapter))

      const hsaTodos = state.db.has('todos').value()

      if (hsaTodos) {
        // state.todos = _cloneDeep(state.db.getState().todos)
        commit('assignTodos', _cloneDeep(state.db.getState().todos))
      } else {
        state.db.defaults({
          todos: []
        }).write()
      }
    },
    createTodo ({ state, commit }, title) {
      const newTodo = {
        id: Math.floor(Math.random() * 100),
        title,
        createdAt: new Date(),
        updatedAt: new Date(),
        done: false
      }

      // Create DB
      commit('createDB', newTodo)

      // Create UI
      commit('pushTodo', newTodo)
    },
    updateTodo ({ state, commit }, { todo, value }) {
      commit('updateDB', { todo, value })

      const foundTodo = _find(state.todos, { id: todo.id })
      commit('assignTodo', { foundTodo, value })
    },
    deleteTodo ({ state, commit }, todo) {
      // Delete DB
      commit('deleteDB', todo)

      const foundIndex = _findIndex(state.todos, { id: todo.id })
      // Delete Client
      commit('deleteTodo', foundIndex)
    },
    completeAll ({ state, commit }, checked) {
      // DB 갱신
      const newTodos = state.db.get('todos').forEach(todo => {
        // todo.done = checked
        commit('updateTodo', {
          todo: todo,
          key: 'done',
          value: checked
        })
      }).write()

      // Local todos 갱신
      // stage.todos = _cloneDeep(newTodos)
      commit('assignTodos', _cloneDeep(newTodos))
    },
    clearCompleted ({ state, dispatch }) {
      // 배열이 삭제되면 값이 밀려 제대로 삭제되지 않음
      // this.todos.forEach(todo => {
      //     if (todo.done) {
      //         this.deleteTodo(todo)
      //     }
      // })

      // this.todos.reduce((list, todo, index) => {
      //     if (todo.done) {
      //         list.push(index)
      //     }
      //     return list
      // }, []).reverse().forEach(index => {
      //     this.deleteTodo(this.todos[index])
      // })

      // lodash 문법 사용버전
      _forEachRight(state.todos, todo => {
        if (todo.done) {
          // this.deleteTodo(todo)
          dispatch.deleteTodo(todo)
        }
      })
    }
  }
}
