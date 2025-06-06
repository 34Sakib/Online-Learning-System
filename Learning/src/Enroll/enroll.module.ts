import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Enroll } from './enroll.entity';
import { EnrollService } from './enroll.service';
import { EnrollController } from './enroll.controller';
import { Course } from '../course/course.entity';
import { User } from '../user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Enroll, Course, User])],
  controllers: [EnrollController],
  providers: [EnrollService],
  exports: [EnrollService],
})
export class EnrollModule {}
