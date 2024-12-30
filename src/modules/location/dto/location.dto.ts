import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from "class-validator";

export class LocationDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    id: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    name_location: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    province: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    country: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    image: string;

}

export class LocationFilterDto {
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

export class UploadImageLocationDto {
    @ApiProperty({ type: 'string', format: 'binary' })
    imageLocation: any;

}