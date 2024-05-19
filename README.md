## Description

'결제선생'이라는 서비스를 벤치마킹 하여 간단한 기능으로만 구현하고자 하는 프로젝트입니다.<br>예약 상품을 판매하고, 결제수단으로 무통장입금을 통한 주문에 대하여 주문 상태를 관리할 수 있도록 합니다.

#### 해당 레포 이외에 로컬에 추가적으로 필요한 것

1. mysql : 데이터베이스는 mysql를 사용하고 있습니다. 실습 프로젝트이므로, user는 root, password는 password240516으로 지정했습니다. reservation_managing 데이터베이스 생성이 필요합니다.
```typescript
// app.module.ts
TypeOrmModule.forRoot({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'password240516',
  database: 'reservation_managing',
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: true,
})
```

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## License

Nest is [MIT licensed](LICENSE).
