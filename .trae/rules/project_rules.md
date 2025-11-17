# 本项目的规则 (Project Rules)

## 1. 核心技术栈 (Tech Stack)
* **框架:** [React 18]
* **语言:** [TypeScript 5.x]
* **构建工具:** [Vite]
* **包管理器:** [pnpm]
* **UI 库:** [MUI (Material-UI) / Ant Design / Chakra UI / **无，请使用原生 CSS/SCSS**] 
    * *(Gemini注：请务必填写真实情况！这直接影响 AI 如何写样式)*

## 2. 样式与布局 (Styling & Layout)
* **首选布局方案：** **Flexbox**。当我要求水平或垂直排列元素时，**必须优先**使用 `display: flex`。
* **布局示例 (重要)：**
    * 要实现水平排列 (像我之前要求的搜索行)：
        ```css
        .container {
          display: flex;
          flex-direction: row;
          align-items: center; /* 垂直居中 */
          gap: 8px; /* 元素间距 */
        }
        ```
* **样式方案：** [CSS Modules / Tailwind CSS / SCSS / styled-components]
    * *(Gemini注：请明确指定一种。如果用 SCSS，AI 就应该创建 .scss 文件，而不是 .css)*
* **禁止：** **严禁**使用**内联样式** (inline styles, 即 `style={{}}`)，除非我明确要求。
* **禁止：** **严禁**使用**绝对定位** (`position: absolute`) 来做页面主布局。

## 3. 代码规范 (Coding Standards)
* **组件：** 始终使用**函数组件 (Functional Components)** 和 **Hooks**。**禁止**使用类组件。
* **文件命名：** [组件使用大驼峰 `MyComponent.tsx`，工具函数使用小驼峰 `utils.ts`]
* **代码风格：** 严格遵守项目根目录下的 `.eslintrc` 和 `.prettierrc` 文件规范。
* **导入：** 总是使用 `@/` 别名来引用 `src/` 目录下的模块 (例如 `@/components/Button`)。

## 4. 文件结构
* **组件:** `src/components/`
* **页面:** `src/pages/`
* **工具:** `src/utils/`
* **样式:** `src/styles/`