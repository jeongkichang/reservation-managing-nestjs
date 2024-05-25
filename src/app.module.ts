import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { ProfileModule } from './profile/profile.module';
import { ProductsModule } from './products/products.module';
import { User } from './users/user.entity';
import { Product } from './products/product.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'password240516',
      database: 'reservation_managing',
      entities: [User, Product],
      synchronize: true,
      // logging: true, // 모든 로그를 활성화
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'), // 정적 파일을 제공할 폴더 설정
    }),
    UsersModule,
    AuthModule,
    DashboardModule,
    ProfileModule,
    ProductsModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
