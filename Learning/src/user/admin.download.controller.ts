import { Controller, Get, UseGuards, Req, Res, ForbiddenException } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Response } from 'express';
import * as PDFDocument from 'pdfkit';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Controller('admin')
export class AdminDownloadController {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('download-info')
  async downloadAdminInfo(@Req() req, @Res() res: Response) {
    if (!req.user || (req.user.role && req.user.role.toLowerCase() !== 'admin')) {
      throw new ForbiddenException('Only admins can download this PDF');
    }
    // Fetch admin user info from DB
    const admin = await this.usersRepository.findOne({ where: { username: req.user.username } });
    if (!admin) {
      res.status(404).json({ message: 'Admin user not found' });
      return;
    }
    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=admin-data.pdf');
    doc.fontSize(18).text('Admin Data Report', { underline: true });
    doc.moveDown();
    doc.fontSize(12).text('Generated at: ' + new Date().toLocaleString());
    doc.moveDown();
    doc.fontSize(16).text('User Information', { underline: true });
    doc.moveDown();
    doc.fontSize(12).text(`Full Name: ${admin.firstName} ${admin.lastName}`);
    doc.fontSize(12).text(`Username: ${admin.username}`);
    doc.fontSize(12).text(`Email: ${admin.email}`);
    doc.fontSize(12).text(`Gender: ${admin.gender}`);
    doc.fontSize(12).text(`Phone: ${admin.phoneNumber}`);
    doc.fontSize(12).text(`Date of Birth: ${admin.dateOfBirth}`);
    doc.fontSize(12).text(`Role: ${admin.role}`);
    // You can add more admin-specific data here
    doc.end();
    doc.pipe(res);
  }
}
