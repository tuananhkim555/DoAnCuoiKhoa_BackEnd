import { Body, Controller, Delete, Get, Headers, Param, ParseIntPipe, Post, Put, Query, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { RoomDto, RoomFilterDto, UploadImageRoomDto } from './dto/room.dto';
import { ApiBody, ApiConsumes, ApiHeader, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import storageLocation from 'src/common/multer/upload-image-location.multer';

@Controller('api/rented-rooms')
export class RoomsController {
    constructor(private readonly roomsService: RoomsService) {}

    // Get all rooms
    @Get()
    async getAllRooms(@Req() req: Request) {
        return this.roomsService.getAllRooms(req);
    }

    // Create a room
    @UseGuards(JwtAuthGuard)
    @ApiHeader({
        name: 'accessToken',
        required: true,
        description: 'Access token for authentication'
    })
    @ApiResponse({ description: 'Success' })
    @Post()
    async createRoom(@Body() body: RoomDto) {
        return this.roomsService.createRoom(body);
    }

    // Get a room by Location ID
    @Get('location')
    async getRoomByLocationId(@Query('id') id: number) {
        return this.roomsService.getRoomByLocationId(id);
    }

     // Phân trang tìm kiếm
     @ApiResponse({
        description: 'Success',
      })
      @ApiQuery({ name: 'pageIndex', description: 'Page number' })
      @ApiQuery({ name: 'pageSize', description: 'Items per page' })
      @ApiQuery({ name: 'keyword', description: 'Search keyword' })
    @Get('search-pagination')
    searchPaginationRooms(@Query() query: RoomFilterDto) {
        return this.roomsService.searchPaginationRooms(query);
    }

    // Get a room by id
    @Get(':id')
    async getRoomById(@Param('id', ParseIntPipe) id: number) {
        return this.roomsService.getRoomById(id);
    }

    // Update a room
    @ApiHeader({
        name: 'accessToken',
        required: true,
        description: 'Access token for authentication'
    })
    @UseGuards(JwtAuthGuard)
    @Put(':id')
    async updateRoom(@Param('id', ParseIntPipe) id: number, @Body() body: RoomDto) {
        return this.roomsService.updateRoom(id, body);
    }

    // Delete a room
    @ApiHeader({
        name: 'accessToken',
        required: true,
        description: 'Access token for authentication'
    })
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async deleteRoom(@Param('id', ParseIntPipe) id: number) {
        return this.roomsService.deleteRoom(id);
    }

    // Upload image room
     @Post('upload-image')
     @UseGuards(JwtAuthGuard)
     @ApiHeader({
         name: 'accessToken',
         required: true,
         description: 'Access token for authentication'
     })
     @ApiHeader({
         name: 'id',
         required: true,
         description: 'ID cần upload ảnh'
     })
     @ApiResponse({ description: 'Success' })
     @UseInterceptors(FileInterceptor('imageRoom', { storage: storageLocation }))
     @ApiConsumes('multipart/form-data')
     @ApiBody({ type: UploadImageRoomDto })
     async uploadAvatarCloud(
         @UploadedFile() file: Express.Multer.File,
         @Headers('id') id: string,
         @Req() req: any
     ) {
         return this.roomsService.uploadImageRoom(parseInt(id), file);
     }
}
