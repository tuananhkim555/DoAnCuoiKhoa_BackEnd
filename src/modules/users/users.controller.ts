import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseInterceptors,
  UploadedFile,
  Req,
  ParseIntPipe,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UsersService } from './users.service';
import {
  CreateUserDto,
  UpdateUserDto,
  UserFilterDto,
  UserNameSearchDto,
  UploadAvatarDto,
} from './dto/users.dto';
import { Request as ExpressRequest } from 'express';
import {
  ApiBody,
  ApiResponse,
  ApiQuery,
  ApiParam,
  ApiConsumes,
  ApiBearerAuth,
  ApiHeader,
} from '@nestjs/swagger';
import storageLocal from 'src/common/multer/upload-local.multer';
import storageCloud from 'src/common/multer/upload-cloud.multer';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

interface RequestWithUser extends ExpressRequest {
  user?: any;
}

@Controller('/api/users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class UsersController {
  constructor(private userService: UsersService) {}

  //Get all users
  @ApiResponse({
    description: 'Success',
  })
  @Get()
  getAllUsers(@Req() req: ExpressRequest) {
    return this.userService.getAllUsers(req);
  }

  //Create user
  @ApiBody({
    type: CreateUserDto,
  })
  @ApiResponse({
    description: 'Success',
  })
  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    console.log('create user api =>', createUserDto);
    return this.userService.createUser(createUserDto);
  }

  //Delete user
  @ApiResponse({
    description: 'Success',
  })
  @Delete(':id')
  deleteUsers(@Param('id', ParseIntPipe) id: number) {
    return this.userService.deleteUsers(id);
  }

  //Get paginated users
  @ApiResponse({
    description: 'Success',
  })
  @ApiQuery({ name: 'pageIndex', description: 'Page number' })
  @ApiQuery({ name: 'pageSize', description: 'Items per page' })
  @ApiQuery({ name: 'keyword', description: 'Search keyword' })
  @Get('phan-trang-tim-kiem')
  getPaginatedUsers(@Query() query: UserFilterDto) {
    return this.userService.getPaginatedUsers(query);
  }

  //Get user by id
  @ApiResponse({
    description: 'Success',
  })
  @Get(':id')
  getUserById(@Param('id', ParseIntPipe) id: number) {
    return this.userService.getUserById(id);
  }

  //Update user
  @ApiBody({
    type: UpdateUserDto,
  })
  @ApiResponse({
    description: 'Success',
  })
  @Put(':id')
  updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateUser(id, updateUserDto);
  }

  //Search users
  @ApiResponse({
    description: 'Success',
  })
  @Get('search/:TenNguoiDung')
  searchUsers(@Param('TenNguoiDung') TenNguoiDung: string) {
    return this.userService.searchUsers({ name: TenNguoiDung });
  }

  //Upload avatar
  @Post('avatar-local')
  @ApiResponse({ description: 'Success' })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer {JWT token}',
    required: true,
  })
  @UseInterceptors(FileInterceptor('avatar', { storage: storageLocal }))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UploadAvatarDto })
  uploadAvatarLocal(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: RequestWithUser
  ) {
    return this.userService.uploadAvatar(file);
  }

  @Post('avatar-cloud')
  @ApiResponse({ description: 'Success' })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer {JWT token}',
    required: true,
  })
  @UseInterceptors(FileInterceptor('avatar', { storage: storageCloud }))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UploadAvatarDto })
  async uploadAvatarCloud(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: RequestWithUser
  ) {
    return this.userService.uploadAvatar(file);
  }
}
