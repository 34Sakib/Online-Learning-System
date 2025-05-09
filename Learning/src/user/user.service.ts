import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async signup(createUserDto: CreateUserDto) { 
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

    const user = this.usersRepository.create({
      firstName: createUserDto.firstName,
      lastName: createUserDto.lastName,
      gender: createUserDto.gender,
      phoneNumber: createUserDto.phoneNumber,
      username: createUserDto.username,
      email: createUserDto.email,
      password: hashedPassword,
      dateOfBirth: createUserDto.dateOfBirth,
      role: createUserDto.role,
    });

    await this.usersRepository.save(user);
    return { message: 'User registered successfully!' };
  }

  async findByUsername(username: string) {
    return this.usersRepository.findOne({ where: { username } });
  }

  async updateProfile(username: string, updateData: UpdateUserDto) {
    const user = await this.findByUsername(username);

    if (!user) {
      throw new Error('User not found');
    }

    if (updateData.password) {
      const salt = await bcrypt.genSalt();
      updateData.password = await bcrypt.hash(updateData.password, salt);
    }

    Object.assign(user, updateData);
    await this.usersRepository.save(user);

    return { message: 'Profile updated successfully!' };
  }
}
