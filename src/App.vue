<template>
  <Suspense>
    <router-view />
  </Suspense>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>

body {
  height: 100%;
}

html {
  height: 100%;
  scroll-behavior: smooth;
}
</style>
