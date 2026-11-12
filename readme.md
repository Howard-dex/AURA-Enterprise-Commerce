# AURA Enterprise Commerce — 企业级全渠道商品推广与 D2C/B2B 数字化营销平台










**AURA Enterprise Commerce** 是一套面向品牌旗舰店与智能硬件厂商的生产级全渠道商品推广与订货平台架构。项目采用 **Next.js 15 (App Router) + React 19 + TypeScript + Tailwind CSS + Prisma (PostgreSQL) + Redis** 构建，原生融合 **D2C 消费者零售直购（个性化选配、激光镌刻、即时结算）** 与 **B2B 企业大宗集采（多级阶梯定价、渠道转售毛利与 ROI 测算、CRM 线索自动分发）** 双引擎模式，支持消费级普通商品与工业智能硬件双业务线无缝切换。

## 1. 核心特性与业务亮点

* **双业务域动态切换（Consumer & Industrial）**：一套底层架构同时驱动“消费级普通商品旗舰店”（无线降噪耳机、钛金属智能腕表、智能家居声学中枢）与“工业智能硬件套系”（边缘 AI 网关控制器、六轴协作机械臂、3D 蓝光轮廓传感器）。
* **实时商品选配与定制工作台（D2C Configurator）**：支持外观配色/表面工艺切换、版本套装升级、免费激光镌刻签名实时预览、Care+ 延保勾选以及按订购数量自动匹配阶梯折扣。
* **大宗团购阶梯定价与渠道 ROI 测算引擎（B2B Pricing Engine）**：内置纯函数式阶梯计价服务（10件 92折 / 50件 85折 / 200+件 78折），支持叠加企业优惠码（`AURA2026`、`VIP88`、`ENTERPRISE90`）并可视化呈现拿货单价曲线与渠道累计净毛利。
* **高可用边缘网关与安全防护（Edge & Security）**：边缘中间件集成多语言自动探测（`zh-CN` / `en-US`）、落地页转化率 A/B 测试流量分桶、全链路 `X-Request-Id` 追踪以及基于 Redis 的分布式滑动窗口 API 限流。
* **自动化 SEO 与结构化数据（Schema.org JSON-LD）**：动态生成符合 Google 与百度富媒体搜索卡片规范的 `Product` 与 `AggregateOffer` 结构化数据，配合 SSR 首屏直出与 ISR 增量静态再生实现毫秒级首屏体验。
* **企业级 CRM 异步线索推送（Webhook Integration）**：B2B 询价接口通过 Zod 严格 Schema 校验后落库 PostgreSQL，并异步推送交互式消息卡片至飞书、企业微信群机器人或 Salesforce CRM。

## 2. 系统五层架构设计

```text
+-----------------------------------------------------------------------------------+
| Layer 01: 全球边缘接入层 (Edge & Middleware - src/middleware.ts)                   |
| • Cloudflare CDN / WAF 防护   • i18n 语言自动嗅探   • 落地页 A/B 分流与 Request-ID |
+-----------------------------------------------------------------------------------+
                                         ↓
+-----------------------------------------------------------------------------------+
| Layer 02: 混合渲染与 SEO 层 (Presentation - Next.js 15 App Router & Tailwind CSS)  |
| • SSR 首屏直出 + ISR 静态再生 • Schema.org/Product JSON-LD • 响应式暗黑玻璃拟态 UI |
+-----------------------------------------------------------------------------------+
                                         ↓
+-----------------------------------------------------------------------------------+
| Layer 03: 领域状态与定价计算层 (Domain & State - Zustand & pricingEngine.ts)       |
| • 购物车与 SKU 定制选配状态同步 • 多级阶梯批发折扣匹配 • 渠道毛利与 ROI 实时推演   |
+-----------------------------------------------------------------------------------+
                                         ↓
+-----------------------------------------------------------------------------------+
| Layer 04: BFF 业务聚合与接口层 (API Route Handlers - Zod + RateLimiter + Webhook) |
| • /api/products (Redis 缓存加速) • /api/checkout (事务下单) • /api/inquiries (CRM) |
+-----------------------------------------------------------------------------------+
                                         ↓
+-----------------------------------------------------------------------------------+
| Layer 05: 数据持久与云原生基础设施层 (Data & DevOps - Prisma + PG16 + Redis + K8s) |
| • PostgreSQL 16 主从事务库 • Redis 7 缓存与限流 • Docker 多阶段构建 & K8s HPA 伸缩 |
+-----------------------------------------------------------------------------------+
```

## 3. 技术栈选型一览

| 架构分层 | 核心技术选型 | 版本要求 | 关键职责与工程价值 |
| :--- | :--- | :--- | :--- |
| **前端与渲染框架** | Next.js (App Router) + React | `^15.0.0` / `^19.0.0` | 服务端渲染 (SSR)、增量静态再生 (ISR)、流式组件渲染 |
| **编程语言与类型** | TypeScript (Strict Mode) | `^5.6.3` | 端到端静态类型安全，杜绝运行时空指针与属性缺失 |
| **UI 与视觉体系** | Tailwind CSS + Chart.js | `^3.4.15` / `^4.4.1` | 响应式流式布局、暗黑工业/奢品美学、实时 ROI 双轴图表 |
| **状态管理** | Zustand | `^5.0.1` | 零样板代码的购物车、SKU 变体选配与促销码状态同步 |
| **接口校验与安全** | Zod + Custom Middleware | `^3.23.8` | 严格校验订单与询价请求载荷，拦截畸形请求与 XSS 注入 |
| **数据库与 ORM** | PostgreSQL + Prisma Client | `16-alpine` / `^5.22.0` | 强类型 Schema 映射、声明式迁移、ACID 订单事务保障 |
| **分布式缓存与限流** | Redis (`ioredis`) | `7-alpine` / `^5.4.1` | 商品目录热点缓存（TTL 300s）、IP 滑动窗口防刷限流 |
| **容器化与编排** | Docker + Kubernetes (HPA) | Node `22-alpine` | 三阶段极小体积镜像构建、K8s 滚动更新与 CPU 70% 自动扩缩容 |

## 4. 工程目录结构

```text
enterprise-product-platform/
├── .github/
│   └── workflows/
│       └── ci-cd.yml               # GitHub Actions 流水线：TypeCheck + Lint + 容器镜像构建
├── k8s/
│   └── deployment.yaml             # Kubernetes Deployment 滚动发布与 HPA 弹性伸缩清单
├── prisma/
│   └── schema.prisma               # PostgreSQL 核心数据模型 (Product, Order, OrderItem, B2BInquiry)
├── src/
│   ├── app/
│   │   └── api/
│   │       ├── products/route.ts   # 商品目录查询接口 (优先读取 Redis 热点缓存)
│   │       ├── checkout/route.ts   # D2C 零售订单创建与折扣核算接口
│   │       └── inquiries/route.ts  # B2B 企业集采/OEM询价提交与飞书/CRM推送接口
│   ├── lib/
│   │   ├── db.ts                   # Prisma Client 全局连接池单例
│   │   ├── redis.ts                # Redis 客户端实例与滑动窗口限流器 checkRateLimit()
│   │   └── seo.ts                  # Schema.org Product JSON-LD 结构化数据生成器
│   ├── services/
│   │   ├── pricingEngine.ts        # 企业多级阶梯定价、延保核算、优惠码与渠道 ROI 计算引擎
│   │   └── erpWebhook.ts           # 飞书 / 企业微信 / Salesforce CRM 交互卡片异步推送服务
│   ├── store/
│   │   └── useCartStore.ts         # Zustand 购物袋状态管理 (增删改、SKU变体合并、优惠券绑定)
│   ├── types/
│   │   └── product.ts              # 商品领域模型、阶梯规则、多语言字典与购物车接口定义
│   └── middleware.ts               # 边缘中间件：i18n Cookie 注入、A/B 测试分桶、Request-ID
├── Dockerfile                      # Node 22 Alpine 三阶段生产级构建文件 (deps -> builder -> runner)
├── docker-compose.yml              # 一键编排 Web 应用 + PostgreSQL 16 + Redis 7
├── next.config.ts                  # AVIF/WebP 图片优化、CSP/HSTS 安全响应头配置
├── package.json                    # 项目脚本与依赖清单
├── tsconfig.json                   # TypeScript 严格模式与路径别名 (@/*) 配置
└── README.md                       # 项目工程文档
```

## 5. 快速开始 (Quick Start)

### 5.1 环境要求

* **Node.js**: `>= 20.10.0`（推荐 `v22 LTS`）
* **PostgreSQL**: `>= 15.0`
* **Redis**: `>= 7.0`
* **Docker & Docker Compose**: 可选，用于一键拉起数据库、缓存与生产容器

### 5.2 本地开发启动

1. **克隆仓库并安装依赖**

```bash
git clone https://github.com/your-org/enterprise-product-platform.git
cd enterprise-product-platform
npm install
```

2. **启动 PostgreSQL 与 Redis 基础容器**

```bash
docker compose up -d db redis
```

3. **配置环境变量 (`.env.local`)**

在项目根目录创建 `.env.local` 文件：

```ini
# PostgreSQL 数据库连接池地址
DATABASE_URL="postgresql://aura:aura_secret@localhost:5432/aura_commerce?schema=public"

# Redis 缓存与分布式限流地址
REDIS_URL="redis://localhost:6379"

# 飞书 / 企业微信 / CRM 线索通知 Webhook (选填)
CRM_WEBHOOK_URL="https://open.feishu.cn/open-apis/bot/v2/hook/your-webhook-token"
```

4. **执行 Prisma 数据库迁移并生成客户端**

```bash
npx prisma generate
npx prisma migrate dev --name init
```

5. **启动 Turbopack 高速开发服务器**

```bash
npm run dev
```

浏览器访问 `http://localhost:3000` 即可查看商品推广展厅与定制工作台。

### 5.3 独立交互式演示版（零依赖单文件预览）

如果您希望在不启动 Node.js 后端与数据库的情况下直接向团队或客户演示完整的前端交互（含普通商品/工业硬件切换、选配定制器、阶梯定价 ROI 图表与内置源码查看器），可直接双击打开随附的 **`enterprise_product_platform.html`** 文件，或通过任意静态服务器托管：

```bash
npx serve .
```

## 6. 核心业务接口规范 (REST API Reference)

### 6.1 获取商品目录与规格列表 (`GET /api/products`)

* **查询参数**：`?line=CONSUMER_FLAGSHIP` 或 `?line=INDUSTRIAL_SMART`
* **缓存策略**：优先检索 Redis 键 `products:catalog:{line}`（TTL 300 秒），未命中时回源 PostgreSQL 并自动回填缓存。

### 6.2 提交零售直购订单 (`POST /api/checkout`)

* **请求示例**：

```json
{
  "customerName": "张明远",
  "customerEmail": "procurement@auracommerce.io",
  "shippingAddress": "上海市浦东新区张江高科技园区科苑路88号",
  "couponCode": "AURA2026",
  "items": [
    {
      "productId": "prod-c1",
      "variantInfo": "香槟流光金 · 标准零售版 · 镌刻: AURA VIP",
      "quantity": 2,
      "unitPrice": 2499
    }
  ]
}
```

### 6.3 提交 B2B 企业集采与渠道合作询价 (`POST /api/inquiries`)

* **限流策略**：基于请求 IP 执行 Redis 滑动窗口限流（默认每分钟最多 10 次请求），超出返回 `429 Too Many Requests`。
* **请求示例**：

```json
{
  "companyName": "星辰严选供应链有限公司",
  "contactPerson": "林总监",
  "contactEmail": "partner@star-supply.cn",
  "contactPhone": "138-0013-8000",
  "cooperationType": "BULK_PURCHASE",
  "estimatedQty": 200,
  "customNotes": "需定制企业专属烫金礼盒与机身激光铭牌"
}
```

## 7. 阶梯定价与促销折扣规则

系统在 `src/services/pricingEngine.ts` 中实现了可扩展的阶梯批发价与优惠码叠加逻辑：

| 采购数量区间 | 阶梯等级名称 | 阶梯折扣率 | 可叠加企业优惠码 | 适用场景 |
| :--- | :--- | :--- | :--- | :--- |
| `1 ~ 9 件` | 官方零售标准价 | `100%` (无阶梯折扣) | `AURA2026` (95折) | 个人消费者 D2C 单件选购与礼物定制 |
| `10 ~ 49 件` | 团队拼团价 | `92%` (92折) | `AURA2026` (95折) / `ENTERPRISE90` (90折) | 部门团建奖品、初创团队办公设备采购 |
| `50 ~ 199 件` | 企业大宗团购价 | `85%` (85折) | `ENTERPRISE90` (90折) / `VIP88` (88折) | 年会福利集采、商务伴手礼定制 |
| `>= 200 件` | 战略集采 / 渠道底价 | `78%` (78折) | `VIP88` (88折) | 区域总代分销拿货、OEM 贴牌联名集采 |

## 8. 容器化与 Kubernetes 生产部署

### 8.1 使用 Docker Compose 一键部署全栈环境

```bash
docker compose up -d --build
```

### 8.2 部署至 Kubernetes 生产集群

项目在 `k8s/deployment.yaml` 中内置了生产级 `Deployment`（4 副本滚动零停机更新、Readiness 存活探针、CPU/内存资源配额）与 `HorizontalPodAutoscaler`（根据 CPU 利用率在 4 至 20 个 Pod 间自动弹性扩缩容）：

```bash
kubectl apply -f k8s/deployment.yaml -n production
kubectl get hpa aura-product-web-hpa -n production
```

## 9. 开源协议 (License)

本项目基于 **MIT License** 开源，您可以自由地将其用于商业品牌官网、跨境独立站或企业级 B2B/D2C 商品推广项目。
