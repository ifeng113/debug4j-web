<template>
  {{clientSessionId}} - {{filePath}}
</template>

<script>
/* eslint-disable */
import webStorage from "@/utils/webStorage.js";
import router from "@/utils/router.js";
import {ref} from "vue";

export default {
  setup() {
    let token = webStorage.getItem('token');
    if (token === undefined) {
      router.push('/login');
    }
    const clientSessionId = ref('');
    const filePath = ref('');
    return {
      clientSessionId,
      filePath,
    }
  },
  data() {
    return {}
  },
  methods: {
    
  },
  mounted() {
    this.clientSessionId = this.$route.query.clientSessionId;
    this.filePath = this.$route.query.filePath;
  }
}
</script>

<style>

</style>
