import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Public } from '../auth/public.decorator';
import { SearchCourseDto } from './dto/search-course.dto';

@Controller('course')
@Controller('course')
@UseGuards(JwtAuthGuard)
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles('admin')
  async create(@Body() createCourseDto: CreateCourseDto) {
    const course = await this.courseService.create(createCourseDto);
  return { message: 'Course created', course };
  }

  @Get()
  @Public()
  findAll() {
    return this.courseService.findAll().then(course => ({ course }));
  }

  @Get(':id')
  @Public()
  findOne(@Param('id') id: string) {
    return this.courseService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  async update(@Request() req, @Param('id') id: string, @Body() updateCourseDto: UpdateCourseDto) {
    const course = await this.courseService.update(+id, updateCourseDto);
    const username = req.user.username;
    return { message: `${username} updated the course successfully!`, course };
  }

  @Get('search/:title')
@Public()
async search(@Param('title') title: string) {
  return this.courseService.searchByTitle(title);
}

  @Post('search')
  @Public()
  async searchByBody(@Body() searchCourseDto: SearchCourseDto) {
    const course = await this.courseService.searchByTitle(searchCourseDto.title);
    return { message: 'Course found.', course };
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  async remove(@Param('id') id: string) {
    await this.courseService.remove(+id);
    return { message: 'Course deleted' };
  }
}