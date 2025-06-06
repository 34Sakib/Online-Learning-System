import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AdminDownloadController } from './admin.download.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { JwtModule } from '@nestjs/jwt';
import { EmailService } from '../email.service';
import { EmailVerificationService } from '../email-verification.service';
import { EmailVerification } from '../email-verification.entity';
import { EmailVerificationModule } from '../email-verification.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, EmailVerification]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
    EmailVerificationModule,
  ],
  controllers: [UserController, AdminDownloadController],
  providers: [UserService, EmailService, EmailVerificationService],
  exports: [UserService], // <-- added
})
export class UserModule {}
