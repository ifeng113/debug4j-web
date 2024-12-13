<template>
  {{clientSessionId}} - {{className}}
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
    const className = ref('');
    return {
      clientSessionId,
      className,
    }
  },
  data() {
    return {
      
    }
  },
  methods: {
    
  },
  mounted() {
    this.clientSessionId = this.$route.query.clientSessionId;
    this.className = this.$route.query.className;
  }
}
</script>

<style>

</style>
