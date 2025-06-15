import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Enroll } from './enroll.entity';
import { EnrollCourseDto } from './dto/enroll-course.dto';
import { Course } from '../course/course.entity';
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

  async getEnrolledCourses(user: any) {
    console.log('DEBUG getEnrolledCourses user:', user);
    const enrollments = await this.enrollRepository.find();
    const courseIds = enrollments.map(e => e.courseId);
    const courses = await this.courseRepository.findByIds(courseIds);
    const filtered = enrollments
      .filter(e => Number(e.studentId) === Number(user.id))
      .map(e => {
        const course = courses.find(c => c.id === e.courseId);
        let startDate: Date | undefined = undefined;
        let endDate: Date | undefined = undefined;
        if (course?.startingdate) {
          const start = new Date(course.startingdate);
          const end = new Date(start);
          end.setDate(start.getDate() + 30); // Default to 30 days duration
          startDate = start;
          endDate = end;
        }
        return {
          ...e,
          startDate: startDate?.toISOString(),
          endDate: endDate?.toISOString(),
          // Optionally include more course fields if needed
        };
      });
    console.log('DEBUG getEnrolledCourses filtered:', filtered);
    return { courses: filtered };
  }

  async getAllEnrollments() {
    // Get all enrollments
    const enrollments = await this.enrollRepository.find();
    if (!enrollments.length) return [];

    // Get all unique student IDs
    const studentIds = [...new Set(enrollments.map(e => e.studentId))];
    // Fetch all users in one query
    const users = await this.userRepository.findByIds(studentIds);
    // Group enrollments by studentId
    const grouped = studentIds.map(studentId => {
      const user = users.find(u => u.id === studentId);
      const studentEnrolls = enrollments.filter(e => e.studentId === studentId);
      return {
        id: user?.id,
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        email: user?.email || '',
        joinDate: user?.createdAt || null, // account creation date for filtering new students this month
        status: 'active', // or derive from user/entity if needed
        courses: studentEnrolls.map(e => ({
        name: e.courseName,
        enrolledAt: e.createdAt ? e.createdAt.toISOString?.() || e.createdAt : null
      }))
      };
    });
    return grouped;
  }
}
