<template>
  <lay-layout>
    <lay-body style="height: 100%">
      <Codemirror id="logBox" v-model:value="code" :options="cmOptions" @change="onChange" @scroll="onScroll"
                  height="99.6%"/>
    </lay-body>
    <lay-footer>
      <lay-panel style="margin-bottom: 5px;background-color: #333">
        <lay-button @click="codeUpdateChange" :type="codeUpdate ? 'warm' : 'primary'">
          <lay-icon type="layui-icon-refresh"></lay-icon>&nbsp;{{ codeUpdate ? '关闭' : '开启' }}更新
        </lay-button>
        <lay-button @click="codeScrollChange" :type="codeScroll ? 'warm' : 'primary'">
          <lay-icon type="layui-icon-slider"></lay-icon>&nbsp;{{ codeScroll ? '关闭' : '开启' }}滚动
        </lay-button>
        <lay-button @click="codeClear" type="danger">
          <lay-icon type="layui-icon-delete"></lay-icon>&nbsp;清空日志
        </lay-button>
      </lay-panel>
    </lay-footer>
  </lay-layout>
</template>

<script>
/* eslint-disable */
import webStorage from "@/utils/webStorage.js";
import router from "@/utils/router.js";
import {ref} from "vue";

import "codemirror/theme/darcula.css"
import Codemirror, {createTitle} from "codemirror-editor-vue3";
import global from "@/utils/global.js";

export default {
  components: {Codemirror},
  setup() {
    let token = webStorage.getItem('token');
    if (token === undefined) {
      router.push('/login');
    }
    const clientSessionId = ref('');
    const filePath = ref('');

    const code = ref('')
    const cmOptions = {
      mode: "log",
      theme: "darcula",
      readOnly: true,
    };

    const codeUpdate = ref(true);
    const codeScroll = ref(true);

    const scrollX = ref(0);
    const scrollY = ref(0);
    const onChange = (val, cm) => {
      if (codeScroll.value) {
        cm.scrollTo(scrollX.value, cm.getScrollInfo().height + cm.getScrollInfo().top);
        scrollY.value = cm.getScrollInfo().top;
      } else {
        cm.scrollTo(scrollX.value, scrollY.value);
      }
    };
    const onScroll = (cm) => {
      if (!codeScroll.value) {
        scrollY.value = cm.getScrollInfo().top;
      }
      scrollX.value = cm.getScrollInfo().left;
    };

    const es = ref();

    return {
      clientSessionId,
      filePath,

      code,
      cmOptions,
      es,
      codeUpdate,
      codeScroll,
      onChange,
      onScroll,

    }
  },
  data() {
    return {}
  },
  methods: {
    loadLog() {
      this.es = new EventSource(global.baseURL + "/attach/task?path=" + this.filePath + "&sessionId=" + this.clientSessionId +
          "&token=" + webStorage.getItem('token') + "&loginId=" + webStorage.getItem('loginId'));
      this.es.onmessage = (event) => {
        if (this.codeUpdate) {
          this.code += `${event.data}` + "\n";
        }
      };
      this.es.onerror = () => {
        this.es.close();
      };
    },
    codeUpdateChange() {
      if (this.codeUpdate) {
        this.code += `${createTitle(" 日志更新截至：" + this.formatTime(new Date()) + " ")}` + "\n";
      }
      this.codeUpdate = !this.codeUpdate;
    },
    codeScrollChange() {
      this.codeScroll = !this.codeScroll;
    },
    codeClear() {
      this.code = '';
    },
    formatTime(date) {
      const options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      };
      return date.toLocaleString('zh-CN', options);
    }
  },
  mounted() {
    this.clientSessionId = this.$route.query.clientSessionId;
    this.filePath = this.$route.query.filePath;
    this.loadLog();
  },
  beforeDestroy() {
    if (this.es) {
      this.es.close();
    }
  }
}
</script>

<style>
#app {
  height: 100%;
}

.layui-layout-vertical {
  height: 100%;
}

</style>
