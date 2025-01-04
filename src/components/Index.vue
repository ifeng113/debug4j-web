<template>
  <lay-panel>
    <lay-row space="20">
      <lay-col md="6" sm="6" xs="6">
        <lay-space>
          <lay-space style="font-weight: bold; width: 100%;min-width: 70px;">应用名称：</lay-space>
          <lay-select style="width: 100%" v-model="appValue" :items="appItem" :options="appItem" :show-search="true" @change="appChange"
                      :disabled="selectLock"></lay-select>
        </lay-space>
      </lay-col>
      <lay-col md="6" sm="6" xs="6">
        <lay-space>
          <lay-space style="font-weight: bold; width: 100%;min-width: 70px;">客户端IP：</lay-space>
          <lay-select style="width: 100%" v-model="clientIpValue" :items="clientIpItem" :options="clientIpItem" :show-search="true"
                      @change="clientIpChange" :disabled="selectLock"></lay-select>
        </lay-space>
      </lay-col>
      <lay-col md="8" sm="8" xs="8">
        <lay-space>
          <lay-space style="font-weight: bold; width: 100%;min-width: 70px;">客户端ID：</lay-space>
          <lay-select style="width: 100%" v-model="clientIdValue" :items="clientIdItem" :options="clientIdItem"
                      :disabled="selectLock"></lay-select>
        </lay-space>
      </lay-col>
      <lay-col md="4" sm="4" xs="4">
        <lay-space :size="20">
          <lay-badge :value="!selectLock ? '' : 'debugging'" :ripple="selectLock">
            <lay-button :type="!selectLock ? 'primary' : 'danger'" @click="debug">Debug</lay-button>
          </lay-badge>
        </lay-space>
      </lay-col>
    </lay-row>
    <lay-line></lay-line>
    <lay-row>
      <lay-descriptions :border="true" style="margin-top: 10px;font-size: 12px">
        <lay-descriptions-item label="客户端主机名">{{ appInfo.socketClientHost }}</lay-descriptions-item>
        <lay-descriptions-item label="客户端外网IP">{{ appInfo.socketClientOutletIp }}</lay-descriptions-item>
        <lay-descriptions-item label="客户端进程ID">{{ appInfo.pid }}</lay-descriptions-item>
        <lay-descriptions-item label="远程调试端口">{{ appInfo.jdwpPort }}</lay-descriptions-item>
        <lay-descriptions-item label="线程通信session">{{ appInfo.threadSession }}</lay-descriptions-item>
        <lay-descriptions-item label="进程通信session">{{ appInfo.processSession }}</lay-descriptions-item>
      </lay-descriptions>
    </lay-row>
  </lay-panel>
  <lay-panel id="proxy">
    <lay-row>
      <router-link to="#proxy">
        <lay-quote>
          <lay-icon type="layui-icon-link"></lay-icon>&nbsp;代理穿透
        </lay-quote>
      </router-link>
    </lay-row>
    <lay-row style="margin-top: 10px;">
      <lay-table :columns="proxyColumns" :data-source="proxyDataSource" :autoColsWidth="true"
                 even>
        <template #allowNetworksSlot="{ row }">
          <lay-space direction="vertical" style="width:100%;">
            <template v-for="(item) in row.allowNetworks">
              <lay-tag>{{ item }}</lay-tag>
            </template>
          </lay-space>
        </template>
        <template #clientOutletIpsSlot="{ row }">
          <lay-space direction="vertical" style="width:100%;">
            <template v-for="(item) in row.clientOutletIps">
              <lay-tag>{{ item }}</lay-tag>
            </template>
          </lay-space>
        </template>
        <template v-slot:toolbar>
          <lay-button type="primary" @click="addProxyClick">
            <lay-icon type="layui-icon-add-one"></lay-icon>&nbsp;新建代理
          </lay-button>
        </template>
      </lay-table>
    </lay-row>
  </lay-panel>
  <lay-panel id="log">
    <lay-row>
      <router-link to="#log">
        <lay-quote>
          <lay-icon type="layui-icon-link"></lay-icon>&nbsp;日志监听
        </lay-quote>
      </router-link>
    </lay-row>
    <lay-row style="margin-top: 10px;">
      <lay-table :columns="logColumns" :data-source="logDataSource" :autoColsWidth="true" even>
        <template v-slot:toolbar>
          <lay-button type="primary" @click="addLogClick">
            <lay-icon type="layui-icon-add-one"></lay-icon>&nbsp;新建监听
          </lay-button>
        </template>
        <template v-slot:logOperator="{ row }">
          <lay-button size="xs" type="danger" @click="logDelete(row.filePath)">删除</lay-button>
          <lay-button size="xs" type="normal" @click="logReader(row.filePath)">查看</lay-button>
        </template>
      </lay-table>
    </lay-row>
  </lay-panel>
  <lay-panel  id="code">
    <lay-row>
      <router-link to="#code">
        <lay-quote>
          <lay-icon type="layui-icon-link"></lay-icon>&nbsp;源码管理
        </lay-quote>
      </router-link>
    </lay-row>
    <lay-row style="margin-top: 10px;">
      <lay-table :columns="codeColumns" :data-source="codeDataSource" :autoColsWidth="true" even>
        <template v-slot:toolbar>
          <lay-input placeholder="请输入源码类名" v-model="codeSearch" :allow-clear="true" @clear="codeSearchChange" @input="codeSearchChange">
            <template #prepend="{ disabled }">类名检索：</template>
          </lay-input>
        </template>
        <template v-slot:codeOperator="{ row }">
          <lay-button size="xs" type="danger" @click="codeReader(row.className)">源码编辑</lay-button>
        </template>
      </lay-table>
    </lay-row>
  </lay-panel>

  <lay-panel style="height: 600px;text-align: center;line-height: 600px">
    <img src="@/assets/logo.png" alt="Logo"/>
  </lay-panel>

  <lay-layer v-model="addProxyOpen" :shade="true" :area="['400px', '530px']" title="新增代理"
             title-style="font-weight: bold;">
    <div style="padding: 20px;">
      <lay-form :model="proxyModel" ref="proxyModelRef" :initValidate="true">
        <lay-form-item label="远程主机" prop="remoteHost" required>
          <lay-input v-model="proxyModel.remoteHost"></lay-input>
        </lay-form-item>
        <lay-form-item label="远程端口" prop="remotePort" required>
          <lay-input v-model="proxyModel.remotePort"></lay-input>
        </lay-form-item>
        <lay-form-item label="代理端口" prop="serverPort">
          <lay-input v-model="proxyModel.serverPort"></lay-input>
        </lay-form-item>
        <lay-form-item label="允许网段" prop="allowNetworks">
          <lay-textarea style="white-space: pre-wrap;" :placeholder="'192.168.1.112/32\n192.168.1.113/32'"
                        v-model="proxyModel.allowNetworks"></lay-textarea>
          <lay-tag style="font-style: italic;font-size: small;" type="warm">注意：多网段请换行填写。</lay-tag>
        </lay-form-item>
        <lay-form-item label="备注" prop="remark">
          <lay-input v-model="proxyModel.remark"></lay-input>
        </lay-form-item>
        <lay-form-item style="text-align: center">
          <lay-button type="primary" @click="proxySubmit" style="width: 100px">新增</lay-button>
        </lay-form-item>
      </lay-form>
    </div>
  </lay-layer>
  <lay-layer v-model="addLogOpen" :shade="true" :area="['550px', '270px']" title="新增监听"
             title-style="font-weight: bold;">
    <div style="padding: 20px;">
      <lay-form :model="logModel" ref="logModelRef" :initValidate="true">
        <lay-form-item label="日志路径" prop="filePath" required>
          <lay-input v-model="logModel.filePath"></lay-input>
        </lay-form-item>
        <lay-form-item label="监听时长" prop="expire" required>
          <lay-input v-model="logModel.expire"></lay-input>
        </lay-form-item>
        <lay-form-item style="text-align: center">
          <lay-button type="primary" @click="logSubmit" style="width: 100px">新增</lay-button>
        </lay-form-item>
      </lay-form>
    </div>
  </lay-layer>
</template>

<script>
/* eslint-disable */
import {reactive, ref} from "vue";
import api from "@/utils/api.js";
import webStorage from '@/utils/webStorage.js';
import router from '@/utils/router.js'

import domMessage from '../utils/messageOnce.js';

const messageOnce = new domMessage();

export default {
  setup() {
    let token = webStorage.getItem('token');
    if (token === undefined) {
      router.push('/login');
    }

    const appValue = ref('');
    const appItem = ref([])
    const clientIpValue = ref('');
    const clientIpItem = ref([])
    const clientIdValue = ref('');
    const clientIdItem = ref([]);
    const appInfo = ref({});
    const selectLock = ref(false);

    const proxyColumns = [
      {
        title: "远程主机",
        width: "150px",
        key: "remoteHost"
      },
      {
        title: "远程端口",
        width: "100px",
        key: "remotePort"
      }, {
        title: "代理端口",
        width: "100px",
        key: "serverPort"
      },
      {
        title: "允许网段",
        width: "120px",
        key: "allowNetworks",
        customSlot: "allowNetworksSlot"
      },
      {
        title: "已连接客户端",
        width: "120px",
        key: "clientOutletIps",
        customSlot: "clientOutletIpsSlot"
      }, {
        title: "备注",
        width: "300px",
        key: "remark",
        ellipsisTooltip: true,
      }
    ]
    const proxyDataSource = ref([])
    const proxyModel = reactive({});
    const addProxyOpen = ref(false);
    const proxyModelRef = ref();

    const logColumns = [
      {
        title: "日志路径",
        width: "150px",
        key: "filePath"
      },
      {
        title: "监听时长（分钟）",
        width: "50px",
        key: "expire"
      }, {
        title: "操作",
        width: "50px",
        customSlot: "logOperator"
      }
    ]
    const logDataSource = ref([])
    const logModel = reactive({});
    const addLogOpen = ref(false);
    const logModelRef = ref();

    const codeSearch = ref('')
    const codeColumns = [
      {
        title: "类名",
        width: "750px",
        key: "className"
      },
      {
        title: "操作",
        width: "50px",
        customSlot: "codeOperator"
      }
    ]
    const codeDataSource = ref([])
    const codeAllDataSource = ref([])

    return {
      appValue,
      appItem,
      clientIpValue,
      clientIpItem,
      clientIdValue,
      clientIdItem,
      appInfo,
      selectLock,

      proxyColumns,
      proxyDataSource,
      proxyModel,
      addProxyOpen,
      proxyModelRef,

      logColumns,
      logDataSource,
      logModel,
      addLogOpen,
      logModelRef,

      codeSearch,
      codeColumns,
      codeDataSource,
      codeAllDataSource,
    }
  },
  data() {
    return {}
  },
  methods: {
    debug() {
      let clientData = webStorage.getItem("clients");
      if (this.clientIdValue !== "") {
        for (let i = 0; i < clientData.length; i++) {
          if (clientData[i].uniqueId === this.clientIdValue) {
            this.appInfo.socketClientHost = clientData[i].socketClientHost;
            this.appInfo.socketClientOutletIp = clientData[i].socketClientOutletIp;
            this.appInfo.pid = clientData[i].pid;
            this.appInfo.jdwpPort = clientData[i].jdwpPort;
            if (clientData[i].debug4jMode === "process") {
              this.appInfo.processSession = clientData[i].clientSessionId;
            } else {
              this.appInfo.threadSession = clientData[i].clientSessionId;
            }
          }
        }
        this.selectLock = !this.selectLock;
        if (!this.selectLock) {
          this.appInfo.socketClientHost = "";
          this.appInfo.socketClientOutletIp = "";
          this.appInfo.pid = "";
          this.appInfo.jdwpPort = "";
          this.appInfo.processSession = "";
          this.appInfo.threadSession = "";
          webStorage.clear("appInfo");
        } else {
          this.appInfo.appValue = this.appValue;
          this.appInfo.appItem = this.appItem;
          this.appInfo.clientIpValue = this.clientIpValue;
          this.appInfo.clientIpItem = this.clientIpItem;
          this.appInfo.clientIdValue = this.clientIdValue;
          this.appInfo.clientIdItem = this.clientIdItem;
          this.appInfo.selectLock = this.selectLock;
          webStorage.setItem("appInfo", this.appInfo);
          this.loadProxy();
          this.loadLog();
          this.loadClass();
        }
      }
    },
    clientIpChange() {
      let clientData = webStorage.getItem("clients");
      this.clientIdValue = '';
      this.clientIdItem = [];
      for (let i = 0; i < clientData.length; i++) {
        if (clientData[i].applicationName === this.appValue && clientData[i].socketClientIp === this.clientIpValue) {
          let app = {label: clientData[i].uniqueId, value: clientData[i].uniqueId};
          if (!this.clientIdItem.some(item => item.label === app.label && item.value === app.value)) {
            this.clientIdItem.push(app);
          }
        }
      }
    },
    appChange() {
      let clientData = webStorage.getItem("clients");
      this.clientIpValue = '';
      this.clientIpItem = [];
      this.clientIdValue = '';
      this.clientIdItem = [];
      for (let i = 0; i < clientData.length; i++) {
        if (clientData[i].applicationName === this.appValue) {
          let app = {label: clientData[i].socketClientIp, value: clientData[i].socketClientIp};
          if (!this.clientIpItem.some(item => item.label === app.label && item.value === app.value)) {
            this.clientIpItem.push(app);
          }
        }
      }
    },
    loadClients() {
      api.getClients().then(response => {
        webStorage.clear("clients");
        webStorage.setItem("clients", response.data.data);
        this.review();
        this.loadProxy();
        this.loadLog();
        this.loadClass();
        let clientData = webStorage.getItem("clients");
        this.appItem = [];
        for (let i = 0; i < clientData.length; i++) {
          let app = {label: clientData[i].applicationName, value: clientData[i].applicationName};
          if (!this.appItem.some(item => item.label === app.label && item.value === app.value)) {
            this.appItem.push(app);
          }
        }
      }).catch(
          () => {
            messageOnce.warning("客户端获取失败，请刷新页面重试！");
          },
      );
    },
    review() {
      let cacheAppInfo = webStorage.getItem("appInfo");
      if (cacheAppInfo !== undefined) {
        let clientData = webStorage.getItem("clients");
        let removed = true;
        for (let i = 0; i < clientData.length; i++) {
          if (clientData[i].uniqueId === cacheAppInfo.clientIdValue) {
            removed = false;
            if (clientData[i].debug4jMode === "process") {
              cacheAppInfo.processSession = clientData[i].clientSessionId;
            } else {
              cacheAppInfo.threadSession = clientData[i].clientSessionId;
            }
          }
        }
        if (!removed) {
          this.appInfo = cacheAppInfo;
          this.appValue = this.appInfo.appValue;
          this.appItem = this.appInfo.appItem;
          this.clientIpValue = this.appInfo.clientIpValue;
          this.clientIpItem = this.appInfo.clientIpItem;
          this.clientIdValue = this.appInfo.clientIdValue;
          this.clientIdItem = this.appInfo.clientIdItem;
          this.selectLock = this.appInfo.selectLock;
        }
      }
    },
    loadProxy() {
      if (this.appInfo.processSession !== undefined) {
        api.getProxy(this.appInfo.processSession).then(response => {
          this.proxyDataSource = response.data.data;
        }).catch(
            () => {
              messageOnce.warning("客户端代理获取失败，请刷新页面重试！");
            },
        );
      }
    },
    addProxyClick() {
      this.addProxyOpen = !this.addProxyOpen;
      this.proxyModel.remoteHost = "";
      this.proxyModel.remotePort = "";
      this.proxyModel.serverPort = "";
      this.proxyModel.allowNetworks = "";
      this.proxyModel.remark = "";
    },
    proxySubmit() {
      this.proxyModelRef.validate((isValidate, model, errors) => {
        if (isValidate) {
          let proxyModel = this.proxyModel;
          proxyModel.allowNetworks = proxyModel.allowNetworks.split('\n');
          proxyModel.clientSessionId = this.appInfo.processSession;
          api.addProxy(proxyModel).then(() => {
            this.loadProxy();
          }).catch(
              () => {
                messageOnce.warning("客户端代理新增失败，请重试！");
              },
          );
          this.addProxyClick();
        } else {
          messageOnce.warning("请完整填写代理配置！")
        }
      })
    },
    loadLog() {
      if (this.appInfo.threadSession !== undefined) {
        let getLog = {"clientSessionId": this.appInfo.threadSession}
        api.getLog(getLog).then(response => {
          this.logDataSource = response.data.data;
        }).catch(
            () => {
              messageOnce.warning("日志监听列表获取失败，请刷新页面重试！");
            },
        );
      }
    },
    addLogClick() {
      this.addLogOpen = !this.addLogOpen;
      this.logModel.filePath = "";
      this.logModel.expire = "";
    },
    logSubmit() {
      this.logModelRef.validate((isValidate, model, errors) => {
        if (isValidate) {
          let logModel = this.logModel;
          logModel.clientSessionId = this.appInfo.threadSession;
          api.addLog(logModel).then(response => {
            let addFlag = true;
            for (let i = 0; i < response.data.data.length; i++) {
              if (response.data.data[i].expire === -1) {
                messageOnce.warning(response.data.data[i].filePath);
                addFlag = false;
              }
            }
            if (addFlag) {
              this.loadLog();
              this.addLogClick();
            }
          }).catch(
              () => {
                messageOnce.warning("日志监听新增失败，请重试！");
              },
          );
        } else {
          messageOnce.warning("请完整填写日志监听配置！")
        }
      })
    },
    logDelete(filePath) {
      let logModel = {"clientSessionId": this.appInfo.threadSession, "filePath": filePath};
      api.deleteLog(logModel).then(() => {
        this.loadLog();
      }).catch(
          () => {
            messageOnce.warning("日志监听失败失败，请重试！");
          },
      );
    },
    logReader(filePath) {
      router.push({path: '/log', query: { clientSessionId: this.appInfo.threadSession, filePath: filePath } })
    },
    codeSearchChange() {
      if (this.codeSearch !== ''){
        this.codeDataSource = [];
        for (let i = 0; i < this.codeAllDataSource.length; i++) {
          if (this.codeAllDataSource[i].className.toLowerCase().includes(this.codeSearch.toLowerCase())){
            let codeAllDataSourceElement = this.codeAllDataSource[i];
            this.codeDataSource.push(codeAllDataSourceElement);
          }
        }
        webStorage.setItem("codeSearch",this.codeSearch );
      } else {
        webStorage.clear("codeSearch");
        this.codeDataSource = this.codeAllDataSource;
      }
    },
    loadClass() {
      if (this.appInfo.threadSession !== undefined) {
        let getCodeClass = {"clientSessionId": this.appInfo.threadSession}
        api.getCodeClass(getCodeClass).then(response => {
          let respData = response.data.data;
          respData.sort();
          for (let i = 0; i < respData.length; i++) {
            this.codeAllDataSource.push({"className": respData[i]});
          }
          let codeSearch = webStorage.getItem("codeSearch");
          if (codeSearch !== undefined){
            this.codeSearch = codeSearch;
          }
          this.codeSearchChange();
        }).catch(
            () => {
              messageOnce.warning("源码类列表获取失败，请刷新页面重试！");
            },
        );
      }
    },
    codeReader(className) {
      router.push({path: '/code', query: { clientSessionId: this.appInfo.threadSession, className: className } })
    }
  },
  mounted: function () {
    this.loadClients();
  }
}
</script>

<style>

</style>
