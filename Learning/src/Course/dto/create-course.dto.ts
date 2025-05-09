import { IsString, IsInt, IsIn, IsOptional } from 'class-validator';

export class CreateCourseDto {
  @IsString()
  title: string;

  @IsString()
  instructor: string;

  @IsString()
  startingdate: Date;

  @IsString()
  type: string;

  @IsOptional()
  @IsIn(['available', 'filledup'])
  status?: 'available' | 'filledup';
}