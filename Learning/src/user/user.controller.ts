import { Controller, Post, Body, UseGuards, Req, BadRequestException, Get, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { EmailService } from '../email.service';
import { EmailVerificationService } from '../email-verification.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly emailService: EmailService,
    private readonly emailVerificationService: EmailVerificationService,
  ) {}

  // 1. Send verification code (for signup or forgot password)
  @Post('send-verification-code')
  async sendVerificationCode(@Body('email') email: string) {
    const code = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code
    await this.emailVerificationService.create(email, code);
    try {
      await this.emailService.sendMail(email, 'Your Verification Code', `Your verification code is: ${code}`);
      return { message: `Verification code is sent to mail: ${email}` };
    } catch (error) {
      console.error('Email send error:', error);
      throw new BadRequestException('Failed to send verification email: ' + (error?.message || error));
    }
  }

  // 2. Verify code (for signup or forgot password)
  @Post('verify-code')
  async verifyCode(@Body('email') email: string, @Body('code') code: string) {
    const record = await this.emailVerificationService.findByEmailAndCode(email, code);
    if (!record) throw new BadRequestException('Invalid code');
    // Optionally, remove the code after verification
    await this.emailVerificationService.remove(record.id);
    return { message: 'Code verified' };
  }

  // 3. Signup with code verification
  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto & { code: string }) {
    // Check code
    const record = await this.emailVerificationService.findByEmailAndCode(createUserDto.email, createUserDto.code);
    if (!record) throw new BadRequestException('Invalid or missing verification code');
    await this.emailVerificationService.remove(record.id);
    return this.userService.signup(createUserDto);
  }

  // 4. Reset password with code verification
  @Post('reset-password')
  async resetPassword(
    @Body('email') email: string,
    @Body('code') code: string,
    @Body('newPassword') newPassword: string
  ) {
    const record = await this.emailVerificationService.findByEmailAndCode(email, code);
    if (!record) throw new BadRequestException('Invalid or expired code');
    await this.userService.resetPasswordWithEmail(email, newPassword);
    await this.emailVerificationService.remove(record.id);
    return { message: 'Password reset successful' };
  }

  // 4. Forgot password (with code verification)
  @Post('forgot-password')
  async forgotPassword(@Body() body: { email: string; newPassword: string; code: string }) {
    const record = await this.emailVerificationService.findByEmailAndCode(body.email, body.code);
    if (!record) throw new BadRequestException('Invalid or missing verification code');
    await this.emailVerificationService.remove(record.id);
    return this.userService.resetPasswordWithEmail(body.email, body.newPassword);
  }

  @UseGuards(JwtAuthGuard)
  @Post('profile/update')
  async updateProfileWithAuth(@Req() req, @Body() updateUserDto: UpdateUserDto) {
    const username = req.user.username;
    return this.userService.updateProfile(username, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('download-info')
  async downloadUserInfo(@Req() req, @Res() res) {
    const username = req.user.username;
    try {
      const pdfBuffer = await this.userService.generateUserInfoPdf(username);
      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="user-info.pdf"`,
      });
      res.end(pdfBuffer);
    } catch (err) {
      res.status(500).json({ message: err.message || 'Failed to generate PDF' });
    }
  }
}

