import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  Matches,
  MinLength,
} from 'class-validator';

export class UserCreateDto {
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @Matches(/^\d+$/)
  phone: string;

  @IsEmail()
  email: string;

  @IsNotEmpty() // Make password required
  @MinLength(6)
  password: string; // Required field

  // Other fields can be omitted or made optional
}
