import { Controller, Post, Body, UnauthorizedException, Inject, NotFoundException } from '@nestjs/common';
import { EnrollService } from './Enroll/enroll.service';
import { UserService } from './user/user.service';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Controller('payment')
export class PaymentVerifyController {
  private stripe: Stripe;

  constructor(
    private readonly configService: ConfigService,
    @Inject(EnrollService) private readonly enrollService: EnrollService,
    @Inject(UserService) private readonly userService: UserService
  ) {
    const stripeKey = this.configService.get<string>('STRIPE_SECRET_KEY');
    if (!stripeKey) {
      throw new Error('STRIPE_SECRET_KEY is not set in environment variables');
    }
    this.stripe = new Stripe(stripeKey);
  }

  @Post('verify')
  async verifyPayment(@Body() body: { sessionId: string; courseId: string; userId: string }) {
    try {
      // Fetch the session from Stripe
      const session = await this.stripe.checkout.sessions.retrieve(body.sessionId);
      if (session.payment_status !== 'paid') {
        throw new UnauthorizedException('Payment not completed');
      }
      // Enroll the user in the course after payment verification
      // 1. Fetch the user entity
      const user = await this.userService.findById(Number(body.userId));
      if (!user) throw new NotFoundException('User not found');
      // 2. Call enrollStudent
      const enrollResult = await this.enrollService.enrollStudent(
        { courseId: Number(body.courseId), payment: 9900 }, // Use actual payment amount if available
        user
      );
      return { success: true, message: 'Payment verified and user enrolled.', enrollResult };

    } catch (err) {
      throw new UnauthorizedException('Payment verification failed');
    }
  }
}
