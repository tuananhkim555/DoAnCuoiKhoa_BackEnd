import { Controller, Post, Body } from '@nestjs/common';
import { User } from '@prisma/client';
import {  LoginDto, RegisterDto } from './dtos/auth.dto';
import { AuthService } from './auth.service';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import { ResponseMessage } from 'src/common/decorater/response-message.decorator';

@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  
  
  @ApiBody({
    type:RegisterDto
  })
  @Post('register')
  @ApiResponse({
    status: 200,
    description: 'Success',
  })
  register(@Body() registerDto: RegisterDto): Promise<User> {
    return this.authService.register(registerDto);
  }


  @ApiBody({
    type: LoginDto
  })
  @Post('login')
  @ApiResponse({
    status: 200,
    description: 'Success',
  })
  @ResponseMessage(`Đăng nhập thành công`)
  login(@Body() loginDto: LoginDto): Promise<any> {
    return this.authService.login(loginDto);
  }
}
