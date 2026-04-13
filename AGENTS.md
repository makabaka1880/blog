# Teal Blog - 项目代理指南

## 项目概述

**Teal Blog** 是一个使用 Nuxt 4 和 Nuxt Content 构建的个人博客系统。该项目采用了现代化的 Web 技术栈，支持 Markdown 内容管理、代码高亮、数学公式渲染等功能，并提供了丰富的自定义组件和主题系统。

### 主要技术栈
- **前端框架**: Nuxt 4, Vue 3
- **内容管理**: @nuxt/content v3.11.0
- **样式系统**: SCSS + 自定义 CSS 变量主题
- **代码高亮**: Shiki (支持多种语言)
- **数学公式**: KaTeX
- **包管理**: pnpm
- **图标系统**: Nuxt Icon + 自定义图标集合
- **颜色模式**: @nuxtjs/color-mode (支持亮色/暗色主题)

## 项目结构

```
blog/
├── app/                    # Nuxt 应用核心文件
│   ├── assets/           # 静态资源 (SCSS, 图标, 主题)
│   ├── components/       # Vue 组件
│   │   ├── blog/        # 博客相关组件
│   │   ├── content/     # 内容展示组件
│   │   ├── page/        # 页面组件
│   │   └── ui/          # UI 组件库
│   ├── composables/     # Vue 组合式函数
│   ├── layouts/         # 页面布局
│   ├── pages/           # 页面路由
│   ├── plugins/         # Vue 插件
│   ├── static/          # 静态文件
│   ├── types/           # TypeScript 类型定义
│   └── utils/           # 工具函数
├── configs/              # 配置文件
├── content/              # Markdown 内容
│   ├── articles/        # 已发布文章
│   └── draft/           # 草稿文章
├── embed/               # 嵌入和内容处理脚本 (Python)
├── public/              # 公共静态资源
├── scripts/             # 项目脚本
└── types/               # 全局类型定义
```

## 构建和运行

### 环境要求
- Node.js >= 20
- pnpm
- Python 3.11+ (可选，用于嵌入和深度图脚本)

### 常用命令

```bash
# 安装依赖
pnpm install

# 开发模式
pnpm dev
# 访问 http://localhost:3000

# 生产构建
pnpm build

# 预览生产构建
pnpm preview

# 生成静态站点
pnpm generate

# 创建新文章草稿
pnpm new:article "文章标题"

# 运行 Python 嵌入图管道 (需要 .venv)
pnpm buildgraph

# 生成深度图
pnpm assets:genmaps
```

### 开发服务器
项目默认在 `localhost:3000` 运行开发服务器。支持热重载和即时预览。

## 内容管理系统

### 内容结构
- **草稿**: `content/draft/` - 使用 `pnpm new:article` 创建
- **已发布文章**: `content/articles/` - 自动从草稿迁移
- **内容配置**: `content.config.ts` - Nuxt Content 集合配置

### Markdown 特性
- **代码高亮**: 支持多种编程语言 (JSON, JS, TS, HTML, CSS, Vue, Shell 等)
- **数学公式**: 使用 KaTeX 渲染 LaTeX 公式
- **自定义组件**: Vue 组件可直接在 Markdown 中使用
- **Frontmatter**: 支持标题、描述、标签等元数据

## 样式表架构 (Stylesheet Architecture)

### 架构概述
Teal Blog 采用分层、模块化的 SCSS 架构，结合 CSS 自定义属性实现动态主题系统。架构设计遵循以下原则：
1. **关注点分离** - 基础样式、主题变量、组件样式分离
2. **语义化命名** - 使用描述性变量名而非具体颜色值
3. **运行时动态性** - 通过 CSS 变量支持主题切换
4. **可维护性** - 模块化组织，易于扩展和修改

### 文件组织结构
```
app/assets/
├── main.scss              # 主样式入口文件
├── base.scss              # 基础/重置样式
├── theme.scss             # 主题变量入口
├── twikoo.scss            # 第三方组件样式
└── theme/                 # 主题系统
    ├── color/            # 颜色系统
    │   ├── color.scss    # 颜色变量定义和工具函数
    │   ├── light.scss    # 亮色主题变量值
    │   └── dark.scss     # 暗色主题变量值
    ├── color-schemes.scss # 颜色方案配置
    ├── layout.scss       # 布局相关变量
    └── misc.scss         # 杂项样式变量
```

### 核心样式文件说明

#### 1. **main.scss** - 主样式入口
```scss
@use './theme.scss' as *;  // 导入主题变量
@import url('https://fonts.googleapis.com/...'); // 字体导入

// 全局样式定义...
```
- 作为 Nuxt 配置中的主要 CSS 入口点
- 负责导入主题系统和外部资源
- 定义全局样式和字体设置

#### 2. **base.scss** - 基础样式
- 包含 CSS 重置和全局选择器样式
- 定义 HTML 元素的基础样式（body, a, headings, tables 等）
- 实现自定义滚动条、选择高亮等浏览器特性
- 使用 CSS 变量确保主题一致性

#### 3. **theme.scss** - 主题系统入口
- 集中导入所有主题相关文件
- 提供统一的主题变量访问点
- 管理颜色、布局、字体等设计令牌

### 颜色系统架构

#### 三层变量结构
```scss
// 第1层: 编译时Sass变量 (Sass编译时确定)
$color-primary: theme-color($default-base-hue, $default-base-saturation, $default-base-lightness);

// 第2层: 运行时CSS变量定义 (color.scss中)
--color-primary-colormode: #{c.theme-color($base-hue, $base-saturation, $base-lightness)};

// 第3层: 运行时CSS变量引用 (所有组件中使用)
color: var(--color-primary);
```

#### 颜色模式实现机制
1. **基础定义层** (`color.scss`)
   - 定义颜色工具函数 (`theme-color()`, `secondary-color()`, `utility-color()`)
   - 设置默认的编译时颜色值
   - 创建运行时 CSS 变量别名系统

2. **主题值层** (`light.scss` / `dark.scss`)
   ```scss
   .light {
     --color-primary-colormode: #{c.theme-color($base-hue, $base-saturation, $base-lightness)};
     --color-background-colormode: #{c.theme-color($base-hue, $base-saturation, $base-lightness, $s-offset: -45%, $l-offset: 52%)};
     // ... 其他颜色变量
   }
   ```

3. **运行时应用层**
   - 通过 `@nuxtjs/color-mode` 在 `<html>` 元素上添加 `.light` 或 `.dark` 类
   - CSS 变量根据当前类名自动应用对应的颜色值

### 变量命名规范

#### 语义化命名模式
```scss
// 结构: --color-{用途}-{状态/变体}
--color-background           // 主要背景
--color-background-alt       // 替代背景
--color-card-background      // 卡片背景
--color-card-hover-background // 卡片悬停背景

// 文本颜色
--color-text                 // 主要文本
--color-text-muted           // 次要文本
--color-text-light           // 浅色文本
--color-heading              // 标题文本

// 交互元素
--color-button-background    // 按钮背景
--color-button-hover-background // 按钮悬停背景
--color-border               // 边框颜色
--color-input-border         // 输入框边框

// 语义颜色
--color-success-background   // 成功状态背景
--color-error-background     // 错误状态背景
--color-warning-background   // 警告状态背景
```

#### 后缀约定
- `-colormode`: 原始主题特定值（如 `--color-primary-colormode`）
- `-runtime`: Sass 运行时变量别名（如 `$color-primary-runtime`）
- 无后缀: 最终应用的 CSS 变量（如 `--color-primary`）

### 颜色工具函数系统

#### 1. **主题颜色生成** (`theme-color()`)
```scss
@function theme-color($base-hue, $base-saturation, $base-lightness, 
                     $h-offset: 0, $s-offset: 0%, $l-offset: 0%, $alpha: 1) {
  // 基于HSL偏移生成协调的颜色
  // 使用OKLCH色彩空间确保视觉一致性
}
```

#### 2. **辅助颜色生成** (`secondary-color()`)
- 基于互补色相生成对比色
- 用于高亮标记、强调元素

#### 3. **实用颜色** (`utility-color()`)
- 预定义的成功、错误、警告、信息状态颜色
- 确保语义颜色在整个应用中保持一致

### 构建和编译流程

#### SCSS 编译链
```
1. Nuxt Vite 构建 → 检测 SCSS 文件更改
2. sass-embedded (Dart Sass) 编译 SCSS
3. PostCSS 处理（自动添加浏览器前缀等）
4. 生成优化的 CSS 输出到 .nuxt/dist/
```

#### 开发工作流
- **热重载**: 修改 SCSS 文件后自动重新编译
- **源映射**: 开发模式下生成源映射便于调试
- **树摇优化**: 生产构建时移除未使用的样式

### 组件样式集成

#### Vue 组件中的样式
```vue
<template>...</template>
<script setup>...</script>
<style lang="scss" scoped>
// 导入主题变量
@use '~/assets/theme.scss' as *;

.component {
  background: var(--color-card-background);
  border: 1px solid var(--color-border);
  color: var(--color-text);
  
  &:hover {
    background: var(--color-card-hover-background);
  }
}
</style>
```

#### 样式作用域策略
- **Scoped Styles**: 组件使用 `scoped` 属性确保样式隔离
- **CSS Modules**: 通过 Vue 单文件组件自动支持
- **全局样式**: 在 `assets/` 目录中定义，通过 `main.scss` 导入

### 响应式设计系统

#### 断点定义
```scss
// 在 layout.scss 中定义
$breakpoint-sm: 640px;
$breakpoint-md: 768px;
$breakpoint-lg: 1024px;
$breakpoint-xl: 1280px;
```

#### 移动优先媒体查询
```scss
.component {
  // 移动端样式（默认）
  padding: 1rem;
  
  @media (min-width: $breakpoint-md) {
    // 平板样式
    padding: 1.5rem;
  }
  
  @media (min-width: $breakpoint-lg) {
    // 桌面样式
    padding: 2rem;
  }
}
```

### 最佳实践指南

#### 1. **颜色使用**
```scss
// 推荐：使用语义化变量
background: var(--color-card-background);

// 避免：硬编码颜色值
background: #ffffff; // ❌ 不要这样做
```

#### 2. **变量管理**
- 新增颜色变量时，更新所有三个层级（Sass变量、CSS变量定义、CSS变量引用）
- 修改现有变量时，检查所有使用该变量的组件
- 删除变量时，确保没有组件依赖它

#### 3. **主题扩展**
要添加新主题（如 sepia）：
1. 创建 `sepia.scss` 主题文件
2. 在 `color-schemes.scss` 中注册新主题
3. 确保 `@nuxtjs/color-mode` 支持新主题类名

### 调试和维护

#### 样式调试工具
- **浏览器开发者工具**: 检查 CSS 变量计算值
- **Vue DevTools**: 查看组件作用域样式
- **Nuxt DevTools**: 分析构建后的 CSS 输出

#### 常见问题解决
1. **颜色不更新**: 检查是否正确导入主题变量
2. **变量未定义**: 确认变量在正确的主题类中定义
3. **特异性冲突**: 使用更具体的选择器或调整样式顺序

### 性能优化

#### CSS 交付优化
- **代码分割**: Nuxt 自动按路由分割 CSS
- **关键CSS**: 重要样式内联，非关键样式异步加载
- **变量复用**: 使用 CSS 变量减少重复的样式声明

#### 构建优化
- **PurgeCSS**: 生产构建时移除未使用的样式
- **Minification**: CSS 压缩减少文件大小
- **Source Maps**: 仅开发环境生成源映射

---

### 颜色模式
项目支持亮色和暗色主题，通过 `@nuxtjs/color-mode` 模块管理：
- **亮色主题**: `app/assets/theme/color/light.scss`
- **暗色主题**: `app/assets/theme/color/dark.scss`
- **基础定义**: `app/assets/theme/color/color.scss`

颜色模式根据系统偏好自动切换，也可手动选择。

## 组件系统

### 组件命名约定
```
# UI 组件
UIKitNav, UIKitFooter, UIKitSafeArea, UIKitComment

# 博客组件
BlogSidebar, BlogSearchModal

# 内容组件
Chat, Chessboard, ChessDisplay, DefBox, DrinkAnimation,
EmojiClock, Folding, MusicPlayer, ParallaxWindow, Pic,
ProseBlockquote, ProseH1-H6, ProseHr, ProsePre, QABox, Tip

# 页面组件
IndexPageHeroSection, IndexPageLatestArticlesSection, IndexPageArtSection
```

### 组件自动导入
Nuxt 自动导入配置在 `nuxt.config.ts` 中，按路径前缀组织组件。

## 特殊功能

### 国际象棋功能
- **棋盘组件**: 使用 `vue3-chessboard`
- **PGN 解析**: 使用 `@mliebelt/pgn-parser`
- **棋子图标**: 自定义 SVG 图标集合 (`icons-chess`)

### 3D 和视觉效果
- **Three.js 集成**: 3D 模型渲染
- **视差效果**: ParallaxWindow 组件
- **动画效果**: @vueuse/motion

### 评论系统
- **Twikoo**: 轻量级评论系统
- **配置**: 在 `blog.config.ts` 中设置 `twikooConfig.envID`

## 配置系统

### 主要配置文件
1. **`blog.config.ts`**: 博客基本信息、作者、版权、高亮主题等
2. **`nuxt.config.ts`**: Nuxt 应用配置、模块、构建选项
3. **`content.config.ts`**: Nuxt Content 配置
4. **`tsconfig.json`**: TypeScript 配置

### 主题配置
- **亮色主题**: `configs/theme-light.json`
- **链接配置**: `configs/blog.links.config.ts`

## Python 集成

### 嵌入图管道
项目包含 Python 脚本用于内容分析和嵌入：

```bash
# 设置 Python 环境
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

# 运行嵌入图管道
python buildgraph.py
```

### 构建钩子
Nuxt 构建前会自动尝试运行 Python 脚本，如果 `.venv` 不存在则跳过。

## 开发约定

### 代码风格
- **Vue 组件**: Composition API + `<script setup>`
- **TypeScript**: 严格类型检查
- **SCSS**: BEM 命名约定，使用 CSS 变量
- **组件组织**: 按功能域分组，使用前缀区分

### 文件命名
- **Vue 组件**: PascalCase (如 `SearchModal.vue`)
- **工具函数**: camelCase (如 `useDrinkEvents.ts`)
- **配置文件**: kebab-case (如 `blog.config.ts`)

### Git 工作流
- 功能分支: `feat/feature-name`
- 修复分支: `fix/bug-description`
- 主分支: `main`

## 部署

### 构建输出
- **SSR 输出**: `.output/` 目录
- **静态站点**: `.output/public/` (通过 `pnpm generate` 生成)
- **Node 服务器**: `.output/server/`

### 环境变量
```env
NUXT_APP_BASE_URL=/  # 应用基础路径
```

## 故障排除

### 常见问题
1. **Python 脚本未运行**: 确保 `.venv` 目录存在且包含 Python 3.11+
2. **颜色模式不切换**: 检查 `@nuxtjs/color-mode` 配置和浏览器控制台
3. **内容不更新**: 清除 Nuxt 缓存 `rm -rf .nuxt .output node_modules/.cache/nuxt`
4. **构建失败**: 检查 Node.js 版本 (需要 >=20) 和 pnpm 安装

### 调试工具
- **Nuxt DevTools**: 开发模式下可用
- **Vue DevTools**: 浏览器扩展
- **控制台日志**: 查看构建和运行时日志

## 扩展和定制

### 添加新组件
1. 在 `app/components/` 的相应子目录中创建 Vue 组件
2. 确保组件命名符合约定
3. 组件会自动导入，无需手动导入

### 修改主题
1. 编辑 `app/assets/theme/color/` 中的 SCSS 文件
2. 更新颜色变量定义
3. 运行 `pnpm build` 测试更改

### 添加内容类型
1. 在 `content.config.ts` 中定义新集合
2. 创建对应的 Markdown 文件结构
3. 更新页面路由和组件

---

*最后更新: 2026-02-16*
*维护者: Makabaka1880*
*许可证: CC BY-NC-SA 4.0*