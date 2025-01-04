# Debug4j-Web

## Introduction
Debug4j-Web is the frontend web interface for visual interaction with [Debug4j-Server](https://github.com/ifeng113/debug4j).

## System Requirements

- **Node.js**: Ensure that Node.js is installed on your system.
- **pnpm**: Use pnpm as the package manager.

## Environment Setup

1. If Node.js is not installed, download and install it from the [Node.js official website](https://nodejs.org/).
2. Install pnpm:

   ```bash
   npm install -g pnpm
   ```

3. If you encounter the following error when running npm commands:

   ```bash
   npm : File C:\Program Files\nodejs\npm.ps1 cannot be loaded because running scripts is disabled on this system.
   ```

   Follow these steps to resolve it:

   1. Open PowerShell and run:

      ```bash
      get-ExecutionPolicy
      ```

   2. If the returned value is `Restricted`, run:

      ```bash
      set-ExecutionPolicy RemoteSigned
      ```

      Confirm by typing `Y` and pressing Enter.

   3. Retry the npm command.

## Project Initialization

1. Create a new project using pnpm:

   ```bash
   pnpm create vue@latest
   ```

   During the interactive prompts, set the project name to `debug4j-web` and select `No` for all options.

2. Navigate to the project directory:

   ```bash
   cd debug4j-web
   ```

3. Install dependencies:

   ```bash
   pnpm install
   ```

## Development Environment

Start the development server with the following command:

```bash
pnpm dev
```

Access the project at [http://localhost:5173](http://localhost:5173).

## Build Project

Build the project for production using the following command:

```bash
pnpm build
```

The generated files will be stored in the `dist` folder.

## Related Components

Install the following dependencies to extend functionality:

1. Install Layui Vue:

   ```bash
   pnpm install @layui/layui-vue --save
   pnpm install @layui/layer-vue --save
   ```

2. Install Vue Router:

   ```bash
   pnpm install vue-router --save
   ```

3. Install Axios:

   ```bash
   pnpm install axios --save
   ```

4. Install Codemirror:

   ```bash
   pnpm install codemirror-editor-vue3 codemirror@^5 --save
   ```

## Notes

- Ensure that your Node.js version meets the minimum requirements for Vue CLI.
- If you encounter dependency issues, try deleting the `node_modules` folder and the `pnpm-lock.yaml` file, then re-run `pnpm install`.
