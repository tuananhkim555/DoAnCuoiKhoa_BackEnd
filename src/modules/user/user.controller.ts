import {
  Controller,
  Get,
  Post,
  Delete,
  Put,
  Body,
  Param,
  Query,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '@prisma/client';
import { UserDto } from './dto/user.dto';
import { UserCreateDto } from './dto/user-create.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import storageLocal from 'src/common/multer/upload-local.multer';
import storageCloud from 'src/common/multer/upload-cloud.multer';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import FileUploadDto from './dto/file-upload.dto';
 // Import storage từ Cloudinary config

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) {}

  @Get()
  getAllUsers(): Promise<User[]> {
    return this.userService.getAllUsers();
  }

  @Post()
  createUser(@Body() userData: UserCreateDto): Promise<User> {
    return this.userService.createUser(userData);
  }

  @Delete(':id')
  deleteUser(@Param('id') id: string): Promise<void> {
    // Sửa thành @Param('id')
    return this.userService.deleteUser(+id); // Chuyển id sang kiểu number
  }

  @Get('phan-trang-tim-kiem')
  paginateAndSearch(@Query() query: any): Promise<User[]> {
    return this.userService.paginateAndSearch(query);
  }

  @Get(':id')
  getUserById(@Param('id') id: string): Promise<User> {
    return this.userService.getUserById(+id); // Chuyển id sang kiểu number
  }

  @Put(':id')
  updateUser(
    @Param('id') id: string,
    @Body() userData: UserDto
  ): Promise<User> {
    return this.userService.updateUser(+id, userData); // Chuyển id sang kiểu number
  }

  @Get('search/:name')
  searchUserByName(@Param('name') name: string): Promise<User[]> {
    return this.userService.searchUserByName(name);
  }

  @Post(`avatar-local`)
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: storageLocal,
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'List of cats',
    type: FileUploadDto,
  })
  uploadAvatarLocal(@UploadedFile() file: Express.Multer.File) {
    return this.userService.uploadAvatar(file);
  }

  @Post(`avatar-cloud`)
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: storageCloud,
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'List of cats',
    type: FileUploadDto,
  })
  uploadAvatarCloud(@UploadedFile() file: Express.Multer.File) {
    return this.userService.uploadAvatar(file);
  }
}


