<template>
  <lay-container>
    <div class="outer-wrap">
      <div class="login-panel">
        <img src="@/assets/logo.png" alt="Logo"/>
        <lay-panel>
          <lay-quote style="text-align: left;">Debug4j 一款高效、便捷的 Java 调试工具。</lay-quote>
          <lay-input class="login_input" prefix-icon="layui-icon-user" placeholder="用户名"
                     v-model="username"></lay-input>
          <lay-input class="login_input" prefix-icon="layui-icon-password" placeholder="密码" v-model="password"
                     type="password" password></lay-input>
          <lay-button class="login_btn" type="primary" @click="login()">进入</lay-button>
        </lay-panel>
      </div>
    </div>
  </lay-container>
</template>

<script>
/* eslint-disable */
import router from '@/utils/router.js'
import api from '../utils/api.js'
import webStorage from '@/utils/webStorage.js';

import domMessage from '../utils/messageOnce.js';
const messageOnce = new domMessage();

export default {
  setup() {
    let token = webStorage.getItem('token');
    if (token !== undefined) {
      router.push('/index');
    }
  },
  data() {
    return {
      username: "",
      password: "",
    }
  },
  mounted() {
    window.addEventListener('keydown', this.handleGlobalEnter);
  },
  unmounted() {
    window.removeEventListener('keydown', this.handleGlobalEnter);
  },
  methods: {
    handleGlobalEnter(event) {
      if (event.key === 'Enter') {
        this.login();
      }
    },
    login() {
      if (this.username !== "" && this.password !== "") {
        const userToken = btoa(this.username + ":" + this.password);
        webStorage.setItem('token', userToken);
        api.getClients().then(() => {
              let loginId = `id-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
              webStorage.setItem('loginId', loginId);
              router.push('/index');
            }
        ).catch(
            err => {
              console.log(err);
            },
        );
      } else {
        messageOnce.warning("Token invalid, 请输入用户名密码！");
      }
    },
  }
}
</script>

<style>

.login_input {
  margin-top: 10px;
}

.login_btn {
  margin-top: 15px;
  width: 100px;
}

.outer-wrap {
  height: 100%;
  position: relative;
  background-color: rgba(0, 0, 0, .5);
}

.login-panel {
  padding: 10px;
  width: 400px;
  position: absolute;
  left: 50%;
  margin-top: 50px;
  margin-left: -200px;
  text-align: center;
}
</style>
