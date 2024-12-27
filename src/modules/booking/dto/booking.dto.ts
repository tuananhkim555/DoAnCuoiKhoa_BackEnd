import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsDate, IsNotEmpty, IsNumber } from "class-validator";

export class CreateBookingDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    id: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    maPhong: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    maNguoiDung: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    soLuongKhach: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsDate()
    @Transform(({ value }) => new Date(value))
    ngayDen: Date;

    @ApiProperty()
    @IsNotEmpty()
    @IsDate()
    @Transform(({ value }) => new Date(value))
    ngayDi: Date;
}

export class UpdateBookingDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    id: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    maPhong: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    maNguoiDung: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    soLuongKhach: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsDate()
    @Transform(({ value }) => new Date(value))
    ngayDen: Date;

    @ApiProperty()
    @IsNotEmpty()
    @IsDate()
    @Transform(({ value }) => new Date(value))
    ngayDi: Date;
}