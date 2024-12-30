import { Body, Controller, Delete, Get, Headers, Param, ParseIntPipe, Post, Put, Query, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { LocationService } from './location.service';
import { LocationDto, LocationFilterDto, UploadImageLocationDto } from './dto/location.dto';
import {  ApiBody, ApiConsumes, ApiHeader, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import storageCloud from 'src/common/multer/upload-cloud.multer';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';


@Controller('api/location')
export class LocationController {
    constructor(private readonly locationService: LocationService) {}

    // Get all locations
    @Get()
    getAllLocations(@Req() req: Request) {
        return this.locationService.getAllLocations(req);
    }

    // Create a new location
    @Post()
    createLocation(@Body() locationDto: LocationDto) {
        return this.locationService.createLocation(locationDto);
    }

    // Phân trang tìm kiếm
    @ApiResponse({
        description: 'Success',
      })
      @ApiQuery({ name: 'pageIndex', description: 'Page number' })
      @ApiQuery({ name: 'pageSize', description: 'Items per page' })
      @ApiQuery({ name: 'keyword', description: 'Search keyword' })
    @Get('search-pagination')
    searchLocations(@Query() query: LocationFilterDto) {
        return this.locationService.searchLocations(query);
    }

    // Get location by id
    @Get(':id')
    getLocationById(@Param('id', ParseIntPipe) id: number) {
        return this.locationService.getLocationById(id);
    }

    // Update location by id
    @Put
    (':id')
    updateLocation(@Param('id', ParseIntPipe) id: number, @Body() locationDto: LocationDto) {
        return this.locationService.updateLocation(id, locationDto);
    }

    // Delete location by id
    @Delete(':id')
    deleteLocation(@Param('id', ParseIntPipe) id: number) {
        return this.locationService.deleteLocation(id);
    }

    // Upload image Location
    @Post('upload-image')
    @UseGuards(JwtAuthGuard)
    @ApiHeader({
        name: 'accessToken',
        required: true,
        description: 'Access token for authentication'
      })
    @ApiHeader({
        name: 'maViTri',
        required: true,
        description: 'Mã vị trí cần upload ảnh'
    })
    @ApiResponse({ description: 'Success' })
    @UseInterceptors(FileInterceptor('avatar', { storage: storageCloud }))
    @ApiConsumes('multipart/form-data')
    @ApiBody({ type: UploadImageLocationDto })
    async uploadAvatarCloud(
      @UploadedFile() file: Express.Multer.File,
      @Headers('maViTri') maViTri: string,
      @Req() req: any
    ) {
      return this.locationService.uploadImageLocation(req.user.id, file);
    }
}
