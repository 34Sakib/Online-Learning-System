import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from './course.entity';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { ILike } from 'typeorm';


@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Course)
    private courseRepository: Repository<Course>,
  ) {}

  create(createCourseDto: CreateCourseDto) {
    const course = this.courseRepository.create(createCourseDto);
    return this.courseRepository.save(course);
  }

  findAll() {
    return this.courseRepository.find();
  }

  findOne(id: number) {
    return this.courseRepository.findOneBy({ id });
  }

  async update(id: number, updateCourseDto: UpdateCourseDto) {
    const course = await this.courseRepository.preload({ id, ...updateCourseDto });
    if (!course) {
      throw new NotFoundException(`Course #${id} not found`);
    }
    return this.courseRepository.save(course);
  }

  async remove(id: number) {
    const course = await this.courseRepository.findOneBy({ id });
    if (!course) {
      throw new NotFoundException(`Course #${id} not found`);
    }
    return this.courseRepository.remove(course);
  }

  async searchByTitle(title: string) {
    return this.courseRepository.find({
      where: { title: ILike(`%${title}%`) }, // Case-insensitive search
    });
  }
}