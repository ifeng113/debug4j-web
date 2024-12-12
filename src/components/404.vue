<template>
  <lay-container class="tip404">
    <lay-exception status="404" title="404" describe="404 Not Found：页面未找到">
      <template #extra>
        <lay-button @click="fallbackPage">返回</lay-button>
        <lay-button type="primary" @click="indexPage">首页</lay-button>
      </template>
    </lay-exception>
  </lay-container>
</template>

<script>
import router from '@/utils/router.js'

export default {
  methods: {
    fallbackPage() {
      router.go(-1);
    },
    indexPage() {
      router.push('/');
    }
  }
}
</script>

<style>
.tip404 {
  margin-top: 200px;
  width: 700px;
}
</style>
