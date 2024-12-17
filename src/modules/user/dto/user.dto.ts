import { User } from '@prisma/client';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  Matches,
  MinLength,
  IsBoolean,
} from 'class-validator';

export class UserDto {
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @Matches(/^\d+$/)
  phone: string;

  @IsEmail()
  email: string;

  @IsOptional() // Make password optional for updates
  @MinLength(6)
  password?: string; // Use optional chaining

  @IsOptional() // Make status optional
  status?: number;

  @IsOptional() // Change gender to boolean
  @IsBoolean()
  gender?: boolean; // Use boolean type

  @IsOptional() // Make role optional
  role?: string; // Use optional chaining
}

// filter search
export interface UserFilterType {
  items_per_page?: number;
  page?: number;
  search?: string;
}

export interface UserPaginationResponseType {
  data: User[];
  total: number;
  currentPage: number;
  itemsPerPage: number;
}
