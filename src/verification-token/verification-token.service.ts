import {
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { VerificationTokenEntity } from './entities/verification-token.entity';
import { MoreThan, MoreThanOrEqual, Repository } from 'typeorm';
import { TimeToMS } from '../utils/time-to-ms';
import { generateString } from '../utils/utils';
import { MailerService } from '@nestjs-modules/mailer';
import { User } from '../users/entities/user';
import { EMAIL_LIMIT_MINUTE } from '../utils/constants';
import * as process from 'process';

@Injectable()
export class VerificationTokenService {
  constructor(
    @InjectRepository(VerificationTokenEntity)
    private tokenRepository: Repository<VerificationTokenEntity>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly mailerService: MailerService,
  ) {}

  async getActiveToken(token: string): Promise<VerificationTokenEntity | null> {
    const verificationToken = await this.tokenRepository.findOneBy({
      token,
      isActive: true,
      expiresAt: MoreThan(new Date().getTime()),
    });

    return verificationToken;
  }

  async deActiveTokens(email: string): Promise<void> {
    await this.tokenRepository.update({ email }, { isActive: false });
  }

  async sendToken(email: string): Promise<any> {
    const nowDate = new Date();
    const oldTokens = await this.tokenRepository.findBy({
      email,
      createdAt: MoreThanOrEqual(
        new Date(nowDate.getTime() - TimeToMS.minute * EMAIL_LIMIT_MINUTE),
      ),
    });

    const user = await this.userRepository.findOneBy({ email });

    if (!user) {
      throw new NotFoundException('User Not Found.');
    }

    if (user.isActive) {
      throw new ForbiddenException('User Is Already Active.');
    }

    if (oldTokens.length !== 0) {
      throw new ForbiddenException(
        'Sending token email limit reached. try again later',
      );
    }

    await this.deActiveTokens(email);

    const verificationToken = generateString(70);

    await this.tokenRepository.insert({
      email: email,
      expiresAt: new Date().getTime() + TimeToMS.hour,
      token: verificationToken,
      isActive: true,
    });

    this.mailerService
      .sendMail({
        from: process.env.SMTP_USERNAME,
        to: email,
        subject: 'Account Verification',
        text: `Click To Verify: \n ${process.env.APP_DOMAIN}/user/verify?token=${verificationToken}`,
      })
      .catch((e) => {
        Logger.warn(`Error With Sending Email: ${e}`);
      });

    return 'Check Your Inbox.';
  }
}
