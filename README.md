# oround-nextjs-image-generator

## Command
- 개발
```
# next dev
npm run dev
```

## Project Dependency
- Next.js (12.x)


## Related Resources
- Github - current
- [Vercel](https://vercel.com/snaps-fe/oround-nextjs-image-generator)

- CDN
  - 운영
    - https://product-image.oround.com <-> https://oround-nextjs-image-generator.vercel.app

##
### Client
TBD:
  - CDN에 캐싱된 리소스 초기화
  - CDN에 이미지 밀어넣기 (전체)

### Server
- pages/api/**
  - 이미지 생성 서버 관련 기능
  - apiResources/**


# AWS ECR
- [prd-oround-image-generator-nextjs](https://ap-northeast-2.console.aws.amazon.com/ecr/repositories/private/012152056735/prd-oround-image-generator-nextjs?region=ap-northeast-2)
- [prd-oround-image-generator-nginx](https://ap-northeast-2.console.aws.amazon.com/ecr/repositories/private/012152056735/prd-oround-image-generator-nginx?region=ap-northeast-2)

# AWS ECS
- [prd-oround-image-generator](https://ap-northeast-2.console.aws.amazon.com/ecs/home?region=ap-northeast-2#/clusters/prd-oround-image-generator/services)

# AWS ECS Task
aws ecs register-task-definition --cli-input-json file://$(pwd)/.snaps-aws/task.json
