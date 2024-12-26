import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsNotEmpty } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  maPhong: number;
    
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  maNguoiBinhLuan: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  ngayBinhLuan: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  noiDung: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  saoBinhLuan: number;
}

export class UpdateCommentDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  maPhong: number;
    
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  maNguoiBinhLuan: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  ngayBinhLuan: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  noiDung: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  saoBinhLuan: number;
}