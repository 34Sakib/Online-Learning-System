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

  async resetPasswordWithEmail(email: string, newPassword: string) {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user) throw new Error('User not found');
    const salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(newPassword, salt);
    await this.usersRepository.save(user);
    return { message: 'Password reset successfully!' };
  }
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

  async findById(id: number) {
    return this.usersRepository.findOne({ where: { id } });
  }

  async findByUsername(username: string) {
    return this.usersRepository.findOne({ where: { username } });
  }

  async findByEmail(email: string) {
    return this.usersRepository.findOne({ where: { email } });
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

  // Generate a PDF with user info and enrolled courses
  async generateUserInfoPdf(username: string): Promise<Buffer> {
    const user = await this.usersRepository.findOne({ where: { username } });
    if (!user) throw new Error('User not found');

    // Use require for pdfkit (CommonJS compatibility)
    const PDFDocument = require('pdfkit');
    const doc = new PDFDocument();
    const buffers: Buffer[] = [];
    doc.on('data', buffers.push.bind(buffers));

    // Add user info
    doc.fontSize(18).text('User Information', { underline: true });
    doc.moveDown();
    doc.fontSize(12).text(`Full Name: ${user.firstName} ${user.lastName}`);
    doc.text(`Username: ${user.username}`);
    doc.text(`Email: ${user.email}`);
    doc.text(`Gender: ${user.gender}`);
    doc.text(`Phone: ${user.phoneNumber}`);
    doc.text(`Date of Birth: ${user.dateOfBirth}`);
    doc.text(`Role: ${user.role}`);
    doc.moveDown();

    // Fetch enrolled courses
    // Use a query to get all enrollments for this user
    const enrollments = await this.usersRepository.manager.find('Enroll', { where: { studentId: user.id } });
    doc.fontSize(16).text('Enrolled Courses', { underline: true });
    doc.moveDown();
    if (enrollments.length === 0) {
      doc.fontSize(12).text('No courses enrolled.');
    } else {
      enrollments.forEach((enroll: any, idx: number) => {
        doc.fontSize(12).text(`${idx + 1}. ${enroll.courseName} (Payment: ${enroll.payment})`);
      });
    }
    doc.end();
    return await new Promise<Buffer>((resolve, reject) => {
      doc.on('end', () => {
        resolve(Buffer.concat(buffers));
      });
      doc.on('error', reject);
    });
  }
}
