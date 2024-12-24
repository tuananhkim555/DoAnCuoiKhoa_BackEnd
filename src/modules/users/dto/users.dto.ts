import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { User } from "@prisma/client";
import { IsEmail, IsNotEmpty, Matches, MinLength } from "class-validator";
import { Type } from "class-transformer";
import { IsInt, IsOptional, IsString, Min } from "class-validator";

export class CreateUserDto {
    @ApiProperty()
    @IsNotEmpty()
    name: string;
    
    @ApiProperty()
    @Matches(/^\d+$/)
    phone: string;

    @ApiProperty()
    @IsEmail()
    email: string;
  
    @ApiProperty()
    @IsNotEmpty()
    @MinLength(6)
    password: string;
  
    @ApiProperty()
    @IsNotEmpty()
    birthday: string;
  
    @ApiPropertyOptional()
    @IsOptional()
    gender: string;
  
    @ApiPropertyOptional()
    @IsOptional() // Make role optional
    role?: string; // Use optional chaining
  
    @IsNotEmpty()
    status: number;
}

export class UpdateUserDto {
    @ApiProperty()
    @IsNotEmpty()
    id: number;

    @ApiProperty()
    @IsNotEmpty()
    name: string;
    
    @ApiProperty()
    @Matches(/^\d+$/)
    phone: string;

    @ApiProperty()
    @IsEmail()
    email: string;
  
    @ApiProperty()
    @IsNotEmpty()
    @MinLength(6)
    password: string;
  
    @ApiProperty()
    @IsNotEmpty()
    birthday: string;
  
    @ApiPropertyOptional()
    @IsOptional()
    gender: string;
  
    @ApiPropertyOptional()
    @IsOptional() // Make role optional
    role?: string; // Use optional chaining
  
    @IsNotEmpty()
    status: number;
  
}

// filter search

export class UserFilterDto {
    @ApiProperty({
        type: Number,
        description: 'Page number',
    })
    @Type(() => Number)
    @IsInt()
    @Min(1)
    pageIndex: number;

    @ApiProperty({
        type: Number,
        description: 'Items per page',
    })
    @Type(() => Number)
    @IsInt()
    @Min(1)
    pageSize: number;

    @ApiProperty({
        type: String,
        example: '',
        description: 'Search keyword',
    })
    @IsOptional()
    @IsString()
    keyword?: string;
}

export class UserNameSearchDto {
    @ApiProperty({
        description: 'TenNguoiDung',
        required: true,
        type: String
    })
    @IsNotEmpty()
    name: string;
}

  export interface UserPaginationResponseType {
    data: User[];
    total: number;
    currentPage: number;
    itemsPerPage: number;
  }

export class UploadAvatarDto {
    @ApiProperty({ type: 'string', format: 'binary' })
    avatar: any;
}