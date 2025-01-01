import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
export class RoomDto {
    @ApiProperty()
    @IsNotEmpty()
    id: number;

    @ApiProperty()
    @IsNotEmpty()
    tenPhong: string;      // Room name

    @ApiProperty()
    @IsNotEmpty()
    khach: number;         // Guests

    @ApiProperty()
    @IsNotEmpty()
    phongNgu: number;      // Bedrooms

    @ApiProperty()
    @IsNotEmpty()
    giuong: number;        // Beds

    @ApiProperty()
    @IsNotEmpty()
    phongTam: number;      // Bathrooms

    @ApiProperty()
    @IsNotEmpty()
    moTa: string;          // Description

    @ApiProperty()
    @IsNotEmpty()
    giaTien: number;       // Price

    @ApiProperty()
    @IsOptional()
    mayGiat?: boolean;

    @ApiProperty()
    @IsOptional()
    banLa?: boolean;

    @ApiProperty()
    @IsOptional()
    tivi?: boolean;

    @ApiProperty()
    @IsOptional()
    dieuHoa?: boolean;

    @ApiProperty()
    @IsOptional()
    wifi?: boolean;

    @ApiProperty()
    @IsOptional()
    bep?: boolean;

    @ApiProperty()
    @IsOptional()
    doXe?: boolean;

    @ApiProperty()
    @IsOptional()
    hoBoi?: boolean;

    @ApiProperty()
    @IsOptional()
    banUi?: boolean;

    @ApiProperty()
    @IsNotEmpty()
    maViTri: number;       // Location ID

    @ApiProperty()
    @IsNotEmpty()
    hinhAnh: string;       // Image
}

export class RoomFilterDto {
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

export class UploadImageRoomDto {
    @ApiProperty({ type: 'string', format: 'binary' })
    imageRoom: any;
}