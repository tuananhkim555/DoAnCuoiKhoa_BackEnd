import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  Matches,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @IsNotEmpty()
  name: string;

  @Matches(/^\d+$/)
  phone: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsNotEmpty()
  birthday: string;

  @IsOptional()
  gender: string;

  @IsOptional() // Make role optional
  role?: string; // Use optional chaining

  @IsNotEmpty()
  status: number;
}

export class LoginDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
