<template>
    <div>
        <button @click="createTodo">
            <i class="material-icons">add</i>
        </button>
        <input
            :value="title"
            :placeholder="placeholder"
            type="text"
            @input="title = $event.target.value"
            @keypress.enter="createTodo"
        />
    </div>
</template>

<script>
export default {
  data () {
    return {
      title: '',
      placeholder: '입력하세요.'
    }
  },
  methods: {
    createTodo: function () {
      const validatedTitle = this.title && this.title.trim()
      if (!validatedTitle) {
        alert('유효하지 않은 값입니다.')
        this.title = this.title.trim()
        return
      }

      // this.$emit('create-todo', this.title)
      this.$store.dispatch('todoApp/createTodo', this.title)
      this.title = ''

      this.$nextTick(() => {
        window.scrollTo(0, document.body.scrollHeight)
      })
    }
  }
}
</script>
