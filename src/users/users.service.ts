import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SignUpUserDto } from './dto/sign-up-user.dto';
import { AccessTokenResponseType } from './types/accessTokenResponseType';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user';
import { Repository } from 'typeorm';
import { AuthService } from '../auth/auth.service';
import * as process from 'process';
import { hash, genSalt, compare } from 'bcrypt';
import { VerificationTokenService } from '../verification-token/verification-token.service';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly authService: AuthService,
    private readonly tokenService: VerificationTokenService,
  ) {}

  async signUp(signUpUserDto: SignUpUserDto): Promise<any | null> {
    const isEmailExists = await this.userRepository.existsBy({
      email: signUpUserDto.email,
    });

    if (isEmailExists) {
      throw new ForbiddenException('A User With This Email Already Exists.');
    }

    const hashSalt = await genSalt();
    const encPass = await hash(signUpUserDto.password, hashSalt);
    const user = await this.userRepository.save({
      ...signUpUserDto,
      isActive: false,
      password: encPass,
    });

    await this.tokenService.sendToken(user.email);

    return { message: 'Verify Your Email To Access Your Account.' };
  }

  async login(loginUserParam: LoginUserDto): Promise<AccessTokenResponseType> {
    const user = await this.userRepository.findOneBy({
      email: loginUserParam.email,
      isActive: true,
    });
    const isPassCorrect =
      user && (await compare(loginUserParam.password, user.password));

    if (!isPassCorrect) {
      throw new UnauthorizedException();
    }

    const JWT_EXPIRES_AT = parseInt(process.env.JWT_EXPIRES_AT);
    const accessToken = await this.authService.signToken({
      id: user.id,
      email: user.email,
      expiresAt: JWT_EXPIRES_AT,
    });

    return {
      accessToken,
      expiresAt: JWT_EXPIRES_AT,
    };
  }

  async verify(token: string): Promise<any> {
    const verificationToken = await this.tokenService.getActiveToken(token);

    if (!verificationToken) {
      throw new ForbiddenException('Token is invalid or expired.');
    }

    await this.userRepository.update(
      { email: verificationToken.email },
      { isActive: true },
    );
    await this.tokenService.deActiveTokens(verificationToken.email);

    return { message: 'Your Email has been verified.' };
  }
}
