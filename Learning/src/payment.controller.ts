import { Controller, Post, Body, NotFoundException, Inject, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { CourseService } from './course/course.service';

@Controller('payment')
export class PaymentController {
  private stripe: Stripe;

  constructor(
    @Inject(CourseService) private readonly courseService: CourseService,
    private readonly configService: ConfigService
  ) {
    const stripeKey = this.configService.get<string>('STRIPE_SECRET_KEY');
    if (!stripeKey) {
      throw new Error('STRIPE_SECRET_KEY is not set in environment variables');
    }
    this.stripe = new Stripe(stripeKey);
  }

  @Post('create-checkout-session')
  async createCheckoutSession(@Body() body: { courseId: string, userEmail: string }) {
  if (!body.userEmail || body.userEmail.trim() === "") {
    throw new BadRequestException('User email is required for payment.');
  }
    // Fetch course from DB
    const course = await this.courseService.findOne(Number(body.courseId));
    if (!course) {
      throw new NotFoundException('Course not found');
    }
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: course.title,
            },
            unit_amount: course.price ? Math.round(Number(course.price) * 100) : 9900, // fallback to $99 if price missing
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: 'http://localhost:3001/payment/success?session_id={CHECKOUT_SESSION_ID}&courseId=' + body.courseId,
      cancel_url: 'http://localhost:3001/payment/cancel',
      customer_email: body.userEmail,
      metadata: { courseId: body.courseId },
    });
    return { url: session.url };
  }
}
