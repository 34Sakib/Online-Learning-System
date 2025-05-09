import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { EnrollService } from './enroll.service';
import { EnrollCourseDto } from './dto/enroll-course.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('enroll')
@UseGuards(JwtAuthGuard)
export class EnrollController {
  constructor(private readonly enrollService: EnrollService) {}

  @Post()
  async enroll(@Body() enrollCourseDto: EnrollCourseDto, @Req() req) {
    // req.user is set by JwtAuthGuard
    return this.enrollService.enrollStudent(enrollCourseDto, req.user);
  }
}
