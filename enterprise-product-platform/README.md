# AURA Commerce & Enterprise Product Promotion Platform (v3.2.0)

企业级全渠道商品推广与 D2C/B2B 一体化电商营销架构（Next.js 15 App Router + TypeScript + Tailwind CSS + Prisma + Redis + Docker + Kubernetes）。

## 1. 核心架构分层 (Layered Enterprise Architecture)

```
enterprise-product-platform/
├── docker-compose.yml                  # 容器编排：Web + PostgreSQL + Redis + Meilisearch
├── Dockerfile                          # 多阶段生产级构建镜像 (Node 22 Alpine)
├── .github/workflows/ci-cd.yml         # CI/CD 流水线：Lint + TypeCheck + E2E + K8s 蓝绿发布
├── k8s/deployment.yaml                 # Kubernetes 生产级 HPA 弹性伸缩与 Ingress 配置
├── prisma/schema.prisma                # 核心数据模型：SPU/SKU、阶梯价格、订单、B2B询价线索、埋点
├── package.json                        # 依赖管理与工程脚本
├── tsconfig.json                       # 严格模式 TypeScript 配置
├── next.config.ts                      # CDN 静态加速、安全响应头 (CSP/HSTS)、国际化配置
└── src/
    ├── middleware.ts                   # 边缘中间件：多语言路由 i18n、A/B 测试分流、防刷限流
    ├── i18n/dictionaries.ts            # 多语言字典 (zh-CN / en-US / ja-JP)
    ├── types/product.ts                # 领域模型类型定义
    ├── store/useCartStore.ts           # Zustand 状态管理：购物车、SKU定制选配、优惠券计算
    ├── lib/
    │   ├── db.ts                       # Prisma 数据库连接池单例
    │   ├── redis.ts                    # Redis 分布式缓存与限流器
    │   ├── seo.ts                      # 动态 Metadata 与 Schema.org Product JSON-LD 生成器
    │   └── analytics.ts                # 企业级全链路转化埋点 SDK (GA4 / Mixpanel / 自建)
    ├── services/
    │   ├── pricingEngine.ts            # 动态阶梯定价、促销满减、渠道利润与 ROI 计算引擎
    │   └── erpWebhook.ts               # SAP / 钉钉 / 企业微信 / Salesforce CRM 异步线索推送
    └── app/
        ├── layout.tsx                  # 全局根布局、SEO 结构化数据、多语言 Provider
        ├── page.tsx                    # 旗舰产品推广落地页 (SSR + ISR 混合渲染)
        └── api/
            ├── products/route.ts       # 商品目录与库存实时查询 REST API (带边缘缓存)
            ├── checkout/route.ts       # 零售直购订单与 Stripe/支付宝 支付会话创建 API
            └── inquiries/route.ts      # 企业大宗团购/分销加盟询价线索提交 API
```

## 2. 核心技术栈选型说明

| 层级 | 技术选型 | 架构优势 |
| :--- | :--- | :--- |
| **渲染与路由层** | Next.js 15 (App Router) + React 19 | 支持 SSR (首屏秒开 SEO)、ISR (增量静态再生) 与 Server Actions |
| **状态与交互层** | TypeScript 5.6 + Zustand + Tailwind CSS | 类型安全、微秒级本地状态同步、响应式设计系统 |
| **BFF 与接口层** | Next.js Route Handlers + Zod | 严格请求体 Schema 校验、分布式滑动窗口限流、ERP/CRM 对接 |
| **数据持久层** | PostgreSQL 16 + Prisma ORM + Redis 7 | 关系型事务保障订单与库存一致性，Redis 承载高并发秒杀与会话缓存 |
| **搜索与推荐** | Meilisearch / Elasticsearch | 毫秒级多属性商品分面检索 (Faceted Search) 与纠错搜索 |
| **可观测性与运维** | Docker + Kubernetes (HPA) + OpenTelemetry | 蓝绿零停机部署、容器自动扩缩容、全链路 APM 监控 |

## 3. 快速启动指南

```bash
# 1. 启动基础设施容器 (PostgreSQL, Redis)
docker compose up -d db redis

# 2. 安装依赖并生成 Prisma Client
npm install
npx prisma migrate dev --name init

# 3. 启动本地开发服务器
npm run dev
```
