import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto) {
    return this.userService.signup(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('profile/update')
  async updateProfileWithAuth(@Req() req, @Body() updateUserDto: UpdateUserDto) {
    const username = req.user.username;
    return this.userService.updateProfile(username, updateUserDto);
  }
}
