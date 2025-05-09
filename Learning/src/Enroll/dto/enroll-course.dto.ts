import { IsInt, IsPositive } from 'class-validator';

export class EnrollCourseDto {
  @IsInt()
  courseId: number;

  @IsInt()
  @IsPositive()
  payment: number;
}
