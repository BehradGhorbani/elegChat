import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { SignUpUserDto } from './dto/sign-up-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { ApiQuery } from '@nestjs/swagger';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/sign-up')
  signUp(@Body() signUpUserDto: SignUpUserDto) {
    return this.usersService.signUp(signUpUserDto);
  }

  @Post('/login')
  login(@Body() loginUserBody: LoginUserDto) {
    return this.usersService.login(loginUserBody);
  }

  @ApiQuery({ name: 'token', required: true })
  @Get('/verify')
  verify(@Query('token') token: string) {
    return this.usersService.verify(token);
  }
}
