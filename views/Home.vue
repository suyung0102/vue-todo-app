<template>
    <section class="home">
        <div>
            <h1>
                Hello World
            </h1>
            <h2 @click="$router.push('/about')">
                About
            </h2>
            <router-link to="/todos" tag="h2">
                Todo App
            </router-link>
        </div>
    </section>
</template>

<script>
export default {
  methods: {
    // toAbout () {
    //     this.$router.push('/about')
    // },
    // toTodoApp () {
    //     this.$router.push('/todos')
    // }
  }
}
</script>
