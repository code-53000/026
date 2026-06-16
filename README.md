# 🪁 风筝飞行志

一款专为风筝爱好者设计的记录工具，帮助您系统化地记录每只风筝的档案信息和每次放飞的详细数据，让宝贵的经验不再流失。

## ✨ 功能特性

### 📋 风筝档案管理
- 记录每只风筝的详细信息：名称、类型（沙燕/蝴蝶/金鱼/老鹰/软体等）、骨架材料、翼展尺寸、制作日期、适合风力档位、骨架修复次数、备注说明
- 卡片式展示，直观美观
- 支持按风筝类型、适合风力档位筛选
- 支持关键词搜索

### 📝 放飞日志管理
- 记录每次放飞的详细数据：日期、使用的风筝、实际风力、放飞地点、飞行时长、飞行表现（1-5星）、备注
- 时间线式展示，清晰明了
- 支持按风筝类型、飞行表现、地点筛选
- 支持关键词搜索

### 📊 数据可视化分析
- **月度放飞次数趋势图**：了解自己的放飞频率
- **风力档位分布图**：统计不同风力下的放飞次数
- **风筝飞行表现对比图**：对比各风筝的平均表现和放飞次数
- **风力与飞行表现关联图**：分析不同风力下的飞行表现

### 🔍 智能筛选
- 按风筝类型筛选
- 按适合风力档位筛选
- 按飞行表现筛选
- 按地点筛选
- 关键词搜索

### 💾 本地存储
- 所有数据保存在浏览器 LocalStorage 中
- 无需后端服务器，保护隐私
- 纯前端应用，打开即用

## 🛠️ 技术栈

- **框架**：Vue 3 + TypeScript
- **构建工具**：Vite 5
- **状态管理**：Pinia
- **路由**：Vue Router 4
- **样式**：Tailwind CSS 3
- **图表**：Chart.js + vue-chartjs
- **图标**：Lucide Vue

## 📦 项目结构

```
src/
├── components/           # 业务组件
│   ├── charts/          # 图表组件
│   │   ├── TrendChart.vue        # 趋势折线图
│   │   ├── CompareChart.vue      # 对比柱状图
│   │   ├── DistributionChart.vue # 分布饼图
│   │   └── WindPerformanceChart.vue # 风力表现散点图
│   ├── flight/          # 放飞日志组件
│   │   ├── FlightCard.vue        # 放飞记录卡片
│   │   ├── FlightFilter.vue      # 放飞筛选器
│   │   └── FlightForm.vue        # 放飞表单
│   ├── kite/            # 风筝档案组件
│   │   ├── KiteCard.vue          # 风筝卡片
│   │   ├── KiteFilter.vue        # 风筝筛选器
│   │   └── KiteForm.vue          # 风筝表单
│   └── layout/          # 布局组件
│       ├── AppHeader.vue         # 顶部导航
│       └── StatsCard.vue         # 统计卡片
├── composables/         # 组合式函数
│   ├── useKiteStore.ts          # 风筝状态管理
│   ├── useFlightStore.ts        # 放飞日志状态管理
│   └── useFilter.ts             # 筛选状态管理
├── pages/               # 页面组件
│   ├── Dashboard.vue            # 首页概览
│   ├── KiteList.vue             # 风筝列表
│   ├── KiteForm.vue             # 风筝表单页
│   ├── KiteDetail.vue           # 风筝详情
│   ├── FlightList.vue           # 放飞日志列表
│   ├── FlightForm.vue           # 放飞表单页
│   └── Analytics.vue            # 数据分析
├── router/              # 路由配置
│   └── index.ts
├── types/               # 类型定义
│   └── index.ts
├── utils/               # 工具函数
│   ├── storage.ts              # 本地存储
│   ├── format.ts               # 格式化工具
│   └── date.ts                 # 日期处理
├── App.vue
├── main.ts
└── style.css
```

## 🚀 快速开始

### 环境要求
- Node.js >= 16.0.0
- npm 或 pnpm

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

启动后访问 `http://localhost:5173` 即可使用。

### 构建生产版本

```bash
npm run build
```

构建产物将生成在 `dist` 目录下。

### 预览生产版本

```bash
npm run preview
```

### 类型检查

```bash
npm run check
```

### 代码检查

```bash
npm run lint
```

## 📱 响应式设计

- 桌面端（>1024px）：完整布局，四列卡片
- 平板端（768-1024px）：两到三列布局
- 移动端（<768px）：单列布局，底部导航，触摸优化

## 🎨 设计理念

采用自然/有机风格，温暖手工质感：

- **主色调**：天空蓝 `#5B9BD5` - 代表风筝飞翔的天空
- **暖棕色**：`#8B5A2B` - 代表竹制骨架
- **米白色**：`#FAF6F0` - 代表宣纸质感
- **点缀色**：珊瑚橙 `#E67E22` - 代表活力和热情
- **字体**：标题使用「Noto Serif SC」（书卷气息，呼应传统工艺），正文使用「Noto Sans SC」（清晰易读）

## 🔮 扩展方向

项目采用模块化设计，便于后续功能扩展：

1. **制作工序图解**：在风筝详情页新增「制作工序」Tab，添加步骤图片和说明
2. **风力提醒**：接入天气 API，在首页显示今日风力并推荐适合的风筝
3. **数据导出**：支持导出 JSON/CSV 格式备份数据
4. **风筝对比**：支持选择多只风筝进行详细参数对比
5. **图片上传**：支持为风筝和放飞记录添加照片
6. **数据备份/恢复**：支持导出和导入完整数据

## 📝 数据存储说明

所有数据存储在浏览器的 LocalStorage 中，键名如下：

- `kite-flyer-kites`：风筝档案数据
- `kite-flyer-flights`：放飞日志数据

**注意**：清除浏览器数据会导致数据丢失，请定期导出备份（后续版本会支持）。

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License
