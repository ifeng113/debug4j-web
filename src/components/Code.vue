<template>
  <lay-layout style="height: 100%;background-color: #555555">
    <lay-header style="height: auto">
      <lay-panel style="background-color: #555555">
        <lay-row space="20">
          <lay-col md="6" sm="6" xs="6">
            <lay-button type="primary" @click="sourceLoad">
              <lay-icon type="layui-icon-download-circle"></lay-icon> &nbsp;加载源码
            </lay-button>
          </lay-col>
          <lay-col md="6" sm="6" xs="6">
            <lay-button type="primary" @click="sourceCopy" :disabled="!codeUpdateEnable">
              <lay-icon type="layui-icon-template"></lay-icon> &nbsp;复制源码
            </lay-button>
          </lay-col>
          <lay-col md="6" sm="6" xs="6">
            <lay-button type="primary" @click="sourceClear" :disabled="!codeUpdateEnable">
              <lay-icon type="layui-icon-delete"></lay-icon> &nbsp;清空编辑区
            </lay-button>
          </lay-col>
          <lay-col md="6" sm="6" xs="6">
            <lay-button type="primary" @click="sourceLineLoad">
              <lay-icon type="layui-icon-fonts-code"></lay-icon> &nbsp;源码行加载
            </lay-button>
          </lay-col>
        </lay-row>
        <lay-row space="20">
          <lay-col md="6" sm="6" xs="6">
            <lay-button type="danger" @click="sourceRestore">
              <lay-icon type="layui-icon-refresh"></lay-icon> &nbsp;源码还原
            </lay-button>
          </lay-col>
          <lay-col md="6" sm="6" xs="6">
            <lay-button type="warm" @click="sourceUpdate" :disabled="!codeUpdateEnable">
              <lay-icon type="layui-icon-upload-drag"></lay-icon> &nbsp;源码更新
            </lay-button>
          </lay-col>
          <lay-col md="6" sm="6" xs="6">
            <lay-button type="warm" @click="sourceByteUpdate" :disabled="!codeUpdateEnable">
              <lay-icon type="layui-icon-upload"></lay-icon> &nbsp;字节码更新
            </lay-button>
          </lay-col>
          <lay-col md="6" sm="6" xs="6">
            <lay-button type="warm" @click="sourceLinePatch">
              <lay-icon type="layui-icon-template-one"></lay-icon> &nbsp;源码行补丁
            </lay-button>
          </lay-col>
        </lay-row>
      </lay-panel>
    </lay-header>
    <lay-container style="width: 100%;height: 100%;background-color: #555555">
      <lay-split-panel style="width: 100%;height: 100%;">
        <lay-split-panel-item>
          <Codemirror id="sourceBox" v-model:value="sourceCode" :options="cmOptions" height="99.6%"/>
        </lay-split-panel-item>
        <lay-split-panel-item space="copyEditWeight">
          <Codemirror id="editBox" v-model:value="copyCode" :options="cmCopyOptions" height="99.6%"/>
        </lay-split-panel-item>
      </lay-split-panel>
    </lay-container>
  </lay-layout>

  <lay-layer v-model="byteUpdateOpen" :shade="true" :area="['350px', '350px']" title="字节码上传"
             title-style="font-weight: bold;">
    <div style="padding: 20px;">
      <lay-form>
        <lay-form-item>
          <lay-upload :drag="true" v-model="byteFile" field="file" :auto="false">
            <template #preview>
              <lay-tag v-show="byteFile.length !== 0">
                <lay-icon type="layui-icon-file-b"/>
                {{ byteFile[0]?.name }}
              </lay-tag>
            </template>
          </lay-upload>
        </lay-form-item>
        <lay-form-item >
          <lay-button type="primary" @click="byteUpdateSubmit" style="width: 120px"><lay-icon type="layui-icon-upload"></lay-icon>&nbsp;上传</lay-button>
        </lay-form-item>
      </lay-form>
    </div>
  </lay-layer>
  <lay-layer v-model="sourceLineGetOpen" :shade="true" :area="['450px', '200px']" title="源码行获取"
             title-style="font-weight: bold;">
    <div style="padding-top: 20px;">
      <lay-form>
        <lay-form-item label="选择方法">
          <lay-select v-model="lineMethodName" :items="lineMethods" :options="lineMethods"></lay-select>
        </lay-form-item>
        <lay-form-item style="text-align: center;">
          <lay-button type="primary" @click="sourceLineGetSubmit" style="width: 120px"><lay-icon type="layui-icon-download-circle"></lay-icon>&nbsp;获取</lay-button>
        </lay-form-item>
      </lay-form>
    </div>
  </lay-layer>
  <lay-layer v-model="sourceLinePatchOpen" :shade="true" :area="['650px', '620px']" title="源码行补丁"
             title-style="font-weight: bold;">
    <div>
      <lay-form>
        <lay-panel style="font-style: italic;font-size: 12px;">
          说明：
          <lay-line></lay-line>
          1、源码行补丁是通过指定源码方法，并在指定源码行前插入补丁代码实现的。
          <lay-line></lay-line>
          2、因反编译限制，此处获取的源码可能与真实源码存在差异，此处选择源码行需要选择真实源码的代码行，或通过源码中的：/* next line number is: xx */ 与代码行下拉框的代码行列表进行顺序匹配，找到需要补丁的源码行。
        </lay-panel>
        <lay-form-item label="补丁方法名">
          <lay-tag type="normal">
            {{lineMethodName}}
          </lay-tag>
        </lay-form-item>
        <lay-form-item label="选择源码行">
          <lay-select v-model="lineNumber" :items="lineNumbers" :options="lineNumbers"></lay-select>
        </lay-form-item>
        <lay-form-item label="补丁代码">
          <lay-textarea style="width: 90%;" :autosize="{minRow: 8}" v-model="lineCode" placeholder="请输入补丁代码"></lay-textarea>
        </lay-form-item>
        <lay-form-item style="text-align: center;">
          <lay-button type="warm" @click="sourceLinePatchSubmit" style="width: 150px"><lay-icon type="layui-icon-upload"></lay-icon>&nbsp;补丁</lay-button>
        </lay-form-item>
      </lay-form>
    </div>
  </lay-layer>

</template>

<script>
/* eslint-disable */
import webStorage from "@/utils/webStorage.js";
import router from "@/utils/router.js";
import {ref} from "vue";
import Codemirror from "codemirror-editor-vue3";

import "codemirror/theme/darcula.css"
import "codemirror/mode/clike/clike.js"
import api from "@/utils/api.js";

import domMessage from '../utils/messageOnce.js';

const messageOnce = new domMessage();

import {layer} from "@layui/layer-vue"

export default {
  components: {Codemirror},
  setup() {
    let token = webStorage.getItem('token');
    if (token === undefined) {
      router.push('/login');
    }
    const clientSessionId = ref('');
    const className = ref('');

    const sourceCode = ref('')
    const copyCode = ref('')
    const cmOptions = {
      mode: "text/x-java",
      theme: "darcula",
      indentUnit: 4,
      readOnly: true,
    };
    const cmCopyOptions = {
      mode: "text/x-java",
      theme: "darcula",
      indentUnit: 4,
    };

    const codeUpdateEnable = ref(true);

    const byteUpdateOpen = ref(false);
    const byteFile = ref([]);

    const sourceLineGetOpen = ref(false);
    const lineMethodName = ref('');
    const lineMethods = ref([]);

    const sourceLinePatchOpen = ref(false);
    const lineNumbers = ref([]);
    const lineNumber = ref(0);
    const lineNumberMethodName = ref('');
    const lineCode = ref('');

    return {
      clientSessionId,
      className,

      sourceCode,
      copyCode,
      cmOptions,
      cmCopyOptions,

      codeUpdateEnable,

      byteUpdateOpen,
      byteFile,

      sourceLineGetOpen,
      lineMethodName,
      lineMethods,

      sourceLinePatchOpen,
      lineNumbers,
      lineNumber,
      lineNumberMethodName,
      lineCode,
    }
  },
  data() {
    return {}
  },
  methods: {
    loadSource() {
      let getSource = {
        "clientSessionId": this.clientSessionId,
        "className": this.className,
        "sourceCodeType": "attachClassByteCode"
      }
      let layerId = layer.load(0, {});
      api.getSource(getSource).then(response => {
        this.sourceCode = response.data.data.classSource;
        this.lineMethods = this.getJavaMethods();
        if (response.data.data.byteCodeType === 'agentWithByteBuddy') {
          this.codeUpdateEnable = false;
          layer.confirm("源码字节码可能被修改？参考：https://blog.csdn.net/weixin_42106289/article/details/128467219",
              {
                title: "异常提示",
                btn: [
                  {
                    text: '已知晓', callback: (id) => {
                      layer.close(id);
                    }
                  }
                ]
              }
          );
        }
        layer.close(layerId);
      }).catch(
          () => {
            messageOnce.warning("源码获取失败，请刷新页面重试！");
            layer.close(layerId);
          },
      );
    },
    sourceLoad() {
      this.loadSource();
    },
    sourceCopy() {
      this.copyCode = this.sourceCode;
    },
    sourceClear() {
      this.copyCode = '';
    },
    sourceLineLoad() {
      this.sourceLineGetOpen = !this.sourceLineGetOpen;
    },
    sourceLineGetSubmit() {
      if (this.lineMethodName === ''){
        messageOnce.warning("请输出方法名！");
      } else {
        this.sourceLineGetOpen = !this.sourceLineGetOpen;
        let sourceLineLoad = {
          "clientSessionId": this.clientSessionId,
          "className": this.className,
          "lineMethodName": this.lineMethodName,
        }
        let layerId = layer.load(0, {});
        api.sourceLineLoad(sourceLineLoad).then(response => {
          this.sourceCode = response.data.data.classSource.replaceAll("\\n", "\n");
          this.lineMethods = this.getJavaMethods();
          this.lineNumbers = [];
          for (let i = 0; i < response.data.data.lineNumbers.length; i++) {
            this.lineNumbers.push({"label": response.data.data.lineNumbers[i], "value": response.data.data.lineNumbers[i]});
          }
          if (this.lineNumbers.length > 0 && this.lineNumber === 0){
            this.lineNumber = this.lineNumbers[0].value;
          }
          this.lineNumberMethodName = this.lineMethodName;
          layer.close(layerId);
        }).catch(
            () => {
              messageOnce.warning("源码行获取失败，请刷新页面重试！");
              layer.close(layerId);
            },
        );
      }
    },
    getJavaMethods() {
      const methodRegex = /\b(?:public|protected|private|static|final|synchronized|abstract)?\s+\b(?:[a-zA-Z_$][a-zA-Z\d_$]*\s+)?[a-zA-Z_$][a-zA-Z\d_$]*\s*\((?:[^()]*(?:\([^)]*\))?)*\)\s*(?:throws\s+[a-zA-Z_$][a-zA-Z\d_$]*(?:\s*,\s*[a-zA-Z_$][a-zA-Z\d_$]*)*)?\s*{/g;
      const matches = this.sourceCode.matchAll(methodRegex);
      const methodNames = [];
      for (const match of matches) {
        const methodSignature = match[0];
        const nameMatch = methodSignature.match(/[a-zA-Z_$][a-zA-Z\d_$]*\s*\(/);
        if (nameMatch) {
          const methodName = nameMatch[0].replace("(", "").trim();
          methodNames.push({"label":methodName, "value":methodName});
        }
      }
      if (methodNames.length > 0 && this.lineMethodName === ''){
        this.lineMethodName = methodNames[0].value;
      }
      return methodNames;
    },
    sourceRestore() {
      layer.confirm("源码将被还原为初始状态，是否继续？",
          {
            title: "源码还原",
            btn: [
              {
                text: '确认', callback: (id) => {
                  let layerId = layer.load(0, {});
                  let sourceRestore = {"clientSessionId": this.clientSessionId, "className": this.className}
                  api.sourceRestore(sourceRestore).then(response => {
                    messageOnce.success("源码还原成功！");
                    this.sourceCode = response.data.data.classSource;
                    this.lineMethods = this.getJavaMethods();
                    layer.close(layerId);
                  }).catch(
                      () => {
                        messageOnce.warning("源码还原失败，请刷新页面重试！");
                        layer.close(layerId);
                      },
                  );
                  layer.close(id);
                }
              },
              {
                text: '取消', callback: (id) => {
                  layer.close(id);
                }
              }
            ]
          }
      );
    },
    sourceUpdate() {
      if (this.copyCode === '') {
        messageOnce.warning("请先复制源码并修改后再更新！");
      } else if (this.copyCode === this.sourceCode) {
        messageOnce.warning("源码未修改，请修改后再更新！");
      } else {
        layer.confirm("源码将被修改，是否继续？",
            {
              title: "源码更新",
              btn: [
                {
                  text: '确认', callback: (id) => {
                    let layerId = layer.load(0, {});
                    let sourceUpdate = {
                      "clientSessionId": this.clientSessionId,
                      "className": this.className,
                      "sourceCode": this.copyCode
                    }
                    api.sourceUpdate(sourceUpdate).then(response => {
                      messageOnce.success("源码更新成功！");
                      this.sourceCode = response.data.data.classSource;
                      this.lineMethods = this.getJavaMethods();
                      layer.close(layerId);
                    }).catch(
                        () => {
                          messageOnce.warning("源码更新失败，请刷新页面重试！");
                          layer.close(layerId);
                        },
                    );
                    layer.close(id);
                  }
                },
                {
                  text: '取消', callback: (id) => {
                    layer.close(id);
                  }
                }
              ]
            }
        );
      }
    },
    sourceByteUpdate() {
      this.byteUpdateOpen = !this.byteUpdateOpen;
    },
    byteUpdateSubmit(){
      let uploadName = this.byteFile[0].name;
      let split = this.className.split(".");
      let handleName = split[split.length - 1] + ".class";
      if (uploadName === handleName){
        this.byteUpdateOpen = !this.byteUpdateOpen;
        let layerId = layer.load(0, {});
        const formData = new FormData();
        formData.append('file', this.byteFile[0]);
        formData.append('clientSessionId', this.clientSessionId);
        formData.append('className', this.className);
        api.sourceByteUpdate(formData).then(response => {
          this.sourceCode = response.data.data.classSource;
          this.lineMethods = this.getJavaMethods();
          layer.close(layerId);
        }).catch(
            () => {
              messageOnce.warning("字节码更新失败，请刷新页面重试！");
              layer.close(layerId);
            },
        );
      } else {
        messageOnce.warning("文件名不匹配，请确认字节码文件名是否为：" + handleName + ".class！");
      }
    },
    sourceLinePatch() {
      if (this.lineNumbers.length > 0){
        this.lineMethodName = this.lineNumberMethodName;
        this.sourceLinePatchOpen = !this.sourceLinePatchOpen;
      } else {
        messageOnce.warning("请先进行源码行加载！");
      }
    },
    sourceLinePatchSubmit() {
      if (this.lineCode === ''){
        messageOnce.warning("请输出补丁代码！");
      } else {
        this.sourceLinePatchOpen = !this.sourceLinePatchOpen;
        let sourceLinePatch = {
          "clientSessionId": this.clientSessionId,
          "className": this.className,
          "lineMethodName": this.lineMethodName,
          "lineNumber": this.lineNumber,
          "sourceCode": this.lineCode,
        }
        let layerId = layer.load(0, {});
        api.sourceLinePatch(sourceLinePatch).then(response => {
          this.sourceCode = response.data.data.classSource.replaceAll("\\n", "\n");
          this.lineMethods = this.getJavaMethods();
          this.lineNumbers = [];
          for (let i = 0; i < response.data.data.lineNumbers.length; i++) {
            this.lineNumbers.push({"label": response.data.data.lineNumbers[i], "value": response.data.data.lineNumbers[i]});
          }
          if (this.lineNumbers.length > 0 && this.lineNumber === 0){
            this.lineNumber = this.lineNumbers[0].value;
          }
          this.lineNumberMethodName = this.lineMethodName;
          layer.close(layerId);
        }).catch(
            () => {
              messageOnce.warning("源码行补丁更新失败，请刷新页面重试！");
              layer.close(layerId);
            },
        );
      }
    },
  },
  mounted() {
    this.clientSessionId = this.$route.query.clientSessionId;
    this.className = this.$route.query.className;

    this.loadSource();
  }
}
</script>

<style>
#app {
  height: 100%;
}

.layui-panel {
  border-width: 0;
}

.lay-split-panel .lay-split-panel-item {
  border-width: 0;
}

.lay-split-panel-horizontal > .lay-split-panel-line {
  width: 5px;
  background-color: #555555;
}

.layui-input-block {
  line-height: 38px;
}
</style>
