import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Enroll } from './enroll.entity';
import { EnrollCourseDto } from './dto/enroll-course.dto';
import { Course } from '../Course/course.entity';
import { User } from '../user/user.entity';

@Injectable()
export class EnrollService {
  constructor(
    @InjectRepository(Enroll)
    private enrollRepository: Repository<Enroll>,
    @InjectRepository(Course)
    private courseRepository: Repository<Course>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async enrollStudent(enrollCourseDto: EnrollCourseDto, student: any) {
    const { courseId, payment } = enrollCourseDto;
    if (payment < 5000) {
      return { message: 'Course enrollment failed.' };
    }
    const course = await this.courseRepository.findOneBy({ id: courseId });
    if (!course) {
      throw new NotFoundException('Course not found');
    }
    if (student.role !== 'student') {
      throw new ForbiddenException('Only students can enroll');
    }
    // Fetch the full user entity
    const user = await this.userRepository.findOne({ where: { username: student.username } });
    if (!user) {
      throw new NotFoundException('Student not found');
    }
    const enroll = this.enrollRepository.create({
      studentId: user.id,
      studentName: user.firstName + ' ' + user.lastName,
      courseId: course.id,
      courseName: course.title,
      payment,
    });
    await this.enrollRepository.save(enroll);
    return { message: 'Congratulations, course enrolled.' };
  }
}
