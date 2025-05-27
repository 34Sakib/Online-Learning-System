import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmailVerification } from './email-verification.entity';

@Injectable()
export class EmailVerificationService {
  constructor(
    @InjectRepository(EmailVerification)
    private readonly emailVerificationRepository: Repository<EmailVerification>,
  ) {}

  async create(email: string, code: string) {
    const entity = this.emailVerificationRepository.create({ email, code });
    return this.emailVerificationRepository.save(entity);
  }

  async findByEmailAndCode(email: string, code: string) {
    // Find the code record
    const record = await this.emailVerificationRepository.findOne({ where: { email, code } });
    if (!record) return null;
    // Check if the code is older than 10 minutes
    const now = new Date();
    const createdAt = new Date(record.createdAt);
    const diffMs = now.getTime() - createdAt.getTime();
    const diffMinutes = diffMs / (1000 * 60);
    if (diffMinutes > 10) {
      // Optionally, remove expired code
      await this.emailVerificationRepository.delete(record.id);
      return null;
    }
    return record;
  }

  async remove(id: number) {
    return this.emailVerificationRepository.delete(id);
  }
}
