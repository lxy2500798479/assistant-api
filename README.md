## 微信外交官管理系统API

作用于微信外交官管理系统API
[![微信外交官管理系统API](https://github.com/effortless-innovations/wechat-diplomat-api/actions/workflows/master.yaml/badge.svg)](https://github.com/effortless-innovations/wechat-diplomat-api/actions/workflows/master.yaml)

## 技术栈
- Hono.js
- Bun.js
- Prisma Client
- Docker
- TypeScript

## 数据存储
- Redis
- PostgreSQL

## 项目结构
- prisma: 数据库模型
- src: 项目源码
- test: 测试用例
- e2e: 端到端测试(http-client)

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run dev
```
## 提交要求
要通过提交要求，必须满足以下条件：
1. `bun run lint`
2. `bun run tsc`

### Build
```shell
docker build -t kennytian/wechat-diplomat-api:latest -f Dockerfile --no-cache .

docker build --platform linux/amd64 -t kennytian/wechat-diplomat-api:0.0.5 -f Dockerfile --no-cache --progress=plain .
```

### Run
```shell
docker rm -f wechat-diplomat-api;docker run -p 3000:3000 --name api --env-file .env kennytian/wechat-diplomat-api:latest
```

### Test
```shell
docker pull kennytian/wechat-diplomat-api:latest
docker rm -f wechat-diplomat-api
docker run --restart=always --env-file .env -p 3004:3000 -d --name cpm-api kennytian/wechat-diplomat-api:latest
docker image prune -f
docker logs -f wechat-diplomat-api
```

open http://localhost:3000
