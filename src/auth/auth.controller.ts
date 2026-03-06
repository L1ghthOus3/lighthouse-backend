/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { AuthService } from './auth.service';
import { LoginUserDto } from './dtos/login.dto';
import { Public } from '../shared/public.decorator';
import { RegisterDto } from './dtos/register.dto';
import { Body, Controller, Post } from '@nestjs/common';
import { User } from 'src/user/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  async register(@Body() registerDto: RegisterDto): Promise<{
    username: string;
    id: string;
    jwt: string;
  }> {
    const user = await this.authService.createUser(registerDto);
    return {
      username: user.username,
      id: user.id,
      jwt: user.jwt,
    };
  }

  @Public()
  @Post('login')
  async login(@Body() loginDto: LoginUserDto): Promise<{
    user: User;
    jwt: string;
  }> {
    const user = await this.authService.login(loginDto);
    return {
      user: user.user,
      jwt: user.jwt,
    };
  }
}
