import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentVerifyController } from './payment.verify.controller';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { CourseModule } from './course/course.module';
import { EnrollModule } from './Enroll/enroll.module';
import { EmailVerificationModule } from './email-verification.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '1234',
      database: 'postgres',
      autoLoadEntities: true,
      synchronize: true,
    }),
    UserModule,
    AuthModule,
    CourseModule,
    EnrollModule,
    EmailVerificationModule,
  ],
  controllers: [PaymentController, PaymentVerifyController],
})
export class AppModule {}