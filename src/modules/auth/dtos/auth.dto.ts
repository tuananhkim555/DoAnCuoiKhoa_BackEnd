import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @Matches(/^\d+$/)
  phone: string;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsOptional()
  birthday?: string;

  @ApiPropertyOptional()
  @IsOptional()
  gender?: string;

  @ApiPropertyOptional()
  @IsOptional()
  role?: string;

}

export class LoginDto {
  @ApiProperty()
  @IsString({ message: `Email phải là string` })
  @IsEmail(undefined, { message: `Email chưa hợp lệ` })
  email: string;

  @ApiProperty()
  @IsString({ message: `Password phải là string` })
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}

