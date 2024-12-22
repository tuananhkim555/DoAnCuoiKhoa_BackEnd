import { Controller, Post, Body } from '@nestjs/common';
import { User } from '@prisma/client';
import { LoginDto, RegisterDto } from './dtos/auth.dto';
import { AuthService } from './auth.service';
import { ApiBody, ApiProperty, ApiPropertyOptional, ApiResponse } from '@nestjs/swagger';
class dataRegister {
    @ApiProperty()
    name: string;

    @ApiProperty()
    email: string;
  
    @ApiProperty()
    password: string;

    @ApiProperty()
    phone: string;

    @ApiProperty()
    birthday: string;

    @ApiPropertyOptional()
    gender: string;
  
    @ApiPropertyOptional() // Make role optional
    role?: string; // Use optional chaining

}

class dataLogin {
    @ApiProperty()
    email: string;

    @ApiProperty()
    password: string;
}
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  
  
  @ApiBody({
    type:dataRegister
  })
  @Post('register')
  @ApiResponse({
    status: 200,
    description: 'Success',
  })
  register(@Body() body: RegisterDto): Promise<User> {
    return this.authService.register(body);
  }


  @ApiBody({
    type: dataLogin
  })
  @Post('login')
  @ApiResponse({
    status: 200,
    description: 'Success',
  })
  login(@Body() body: LoginDto): Promise<any> {
    return this.authService.login(body);
  }
}
