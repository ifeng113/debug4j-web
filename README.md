# Debug4j-Web

## 简介
Debug4j-Web 是 Debug4j-Server 可视化交互的前端 Web 页面。本 README 将指导您如何在本地环境中安装、开发和构建该项目。

## 系统要求

- **Node.js**: 请确保您的计算机已安装 Node.js。
- **pnpm**: 使用 pnpm 作为包管理工具。

## 环境设置

1. 如果尚未安装 Node.js，请访问 [Node.js 官网](https://nodejs.org/)下载安装。
2. 安装 pnpm：

   ```bash
   npm install -g pnpm
   ```

3. 如果在运行 npm 命令时遇到如下错误：

   ```bash
   npm : 无法加载文件 C:\Program Files\nodejs\npm.ps1，因为在此系统上禁止运行脚本。
   ```

   请按照以下步骤解决：

   1. 打开 PowerShell，运行：

      ```bash
      get-ExecutionPolicy
      ```

   2. 如果返回值为 `Restricted`，运行：

      ```bash
      set-ExecutionPolicy RemoteSigned
      ```

      输入 `Y` 确认。

   3. 重新尝试执行 npm 命令。

## 项目初始化

1. 使用 pnpm 创建项目：

   ```bash
   pnpm create vue@latest
   ```

   在交互式提示中填写项目名称为 `debug4j-web`，并在选项中选择全部 `No`。

2. 切换到项目目录：

   ```bash
   cd debug4j-web
   ```

3. 安装依赖：

   ```bash
   pnpm install
   ```

## 开发环境

运行以下命令启动开发服务器：

```bash
pnpm dev
```

访问 [http://localhost:5173](http://localhost:5173) 查看项目。

## 构建项目

运行以下命令构建生产环境代码：

```bash
pnpm build
```

生成的文件将存储在 `dist` 文件夹中。

## 相关组件

安装以下依赖以扩展功能：

1. 安装 Layui Vue：

   ```bash
   pnpm install @layui/layui-vue --save
   pnpm install @layui/layer-vue --save
   ```

2. 安装 Vue Router：

   ```bash
   pnpm install vue-router --save
   ```

3. 安装 Axios：

   ```bash
   pnpm install axios --save
   ```

4. 安装 Codemirror：

   ```bash
   pnpm install codemirror-editor-vue3 codemirror@^5 --save
   ```

## 注意事项

- 请确保 Node.js 版本符合 Vue CLI 的最低要求。
- 如果遇到依赖问题，请尝试删除 `node_modules` 文件夹和 `pnpm-lock.yaml` 文件，然后重新运行 `pnpm install`。