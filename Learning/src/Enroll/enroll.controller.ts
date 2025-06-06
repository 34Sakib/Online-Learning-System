import { Controller, Post, Body, Req, UseGuards, Get } from '@nestjs/common';
import { EnrollService } from './enroll.service';
import { EnrollCourseDto } from './dto/enroll-course.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('user')
@UseGuards(JwtAuthGuard)
export class EnrollController {
  constructor(private readonly enrollService: EnrollService) {}

  @Post('enroll')
  async enroll(@Body() enrollCourseDto: EnrollCourseDto, @Req() req) {
    // req.user is set by JwtAuthGuard
    return this.enrollService.enrollStudent(enrollCourseDto, req.user);
  }

  @Get('enrolled-courses')
  async getEnrolledCourses(@Req() req) {
    // req.user is set by JwtAuthGuard
    return this.enrollService.getEnrolledCourses(req.user);
  }

  // ADMIN: Get all enrollments
  @Get('all-enrollments')
  @UseGuards(JwtAuthGuard)
  async getAllEnrollments(@Req() req) {
    if (!req.user || req.user.role !== 'admin') {
      return { message: 'Forbidden' };
    }
    return this.enrollService.getAllEnrollments();
  }
}
