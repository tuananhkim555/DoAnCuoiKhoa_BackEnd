import { HttpException, HttpStatus, Injectable, BadRequestException } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto, UserFilterDto, UserNameSearchDto } from './dto/users.dto';
import * as bcrypt from 'bcrypt';
import { Gender, Role, User } from '@prisma/client';
import { PrismaService } from '../../common/prisma/prisma.service';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';

declare module 'express' {
    interface Request {
        user?: any;  // Or define a more specific type for your user
    }
}

@Injectable()
export class UsersService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
    ) {}

    //Get all users
    getAllUsers = async(req: Request) => {
        let { pageIndex, pageSize } = req.query as any;

        pageIndex = +pageIndex > 0 ? +pageIndex : 1; //chuỗi convert '' sang Number
        pageSize = +pageSize > 0 ? +pageSize : 3;

        const skip = (pageIndex - 1) * pageSize;
        const totalItems = await this.prisma.user.count();
        const totalPages = Math.ceil(totalItems / pageSize);
        // skip: (page -1) * pageSize,

    const users = await this.prisma.user.findMany({
      take: pageSize, //Limit
      skip: skip, //Offset

      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      pageIndex: pageIndex,
      pageSize: pageSize,
      totalItems: totalItems,
      totalPages: totalPages,
      items: users || [],
    };
  }

   //Create user
    createUser = async (body: CreateUserDto): Promise<User> => {
        //step 1: kiểm tra xem email đã được sử dụng chưa
        const user = await this.prisma.user.findUnique({
          where: {
            email: body.email,
          },
        });
    
        if (user) {
          throw new HttpException(
            { message: 'Email này đã được sử dụng' },
            HttpStatus.BAD_REQUEST,
          );
        }
        // step 2: mã hóa mật khẩu và lưu vào cơ sở dữ liệu
        const hashedPassword = await bcrypt.hash(body.password, 10);
        const result = await this.prisma.user.create({
          data: { ...body, password: hashedPassword, role: body.role as Role, gender: body.gender as Gender},
        });
        return result;
      }

    //Delete user
    deleteUsers = async (id: number) => {
        return this.prisma.user.delete({
            where: { id: id },
          });
    }

    //Get user by id
    getUserById = async (id: number) => {
        return this.prisma.user.findUnique({
            where: { id: +id },
          });
    }

    //Get paginated users
    getPaginatedUsers = async (filters: UserFilterDto) => {
        const { pageIndex, pageSize, keyword } = filters;
        const items_per_page = (pageSize);
        const page = (pageIndex);
        const search = keyword || '';
    
        const skip = page > 1 ? (page - 1) * items_per_page : 0;
        const users = await this.prisma.user.findMany({
          take: items_per_page,
          skip,
          where: {
            OR: [
              {
                name: {
                  contains: search,
                },
              },
              {
                email: {
                  contains: search,
                },
              },
            ],
            AND: [
              {
                status: 1,
              },
            ],
          },
          orderBy: {
            createdAt: 'desc',
          },
        });
    
        const total = await this.prisma.user.count({
          where: {
            OR: [
              {
                name: {
                  contains: search,
                },
              },
              {
                email: {
                  contains: search,
                },
              },
            ],
            AND: [
              {
                status: 2,
              },
            ],
          },
        });
    
        return {
          data: users,
          total,
          currentPage: page,
          itemsPerPage: items_per_page,
        };
    }

    //Update user
    updateUser = async (id: string, updateUserDto: UpdateUserDto) => {
          //step 1: kiểm tra xem email đã được sử dụng chưa
          const user = await this.prisma.user.findUnique({
            where: {
              email: updateUserDto.email,
            },
          });
      
          if (user) {
            throw new HttpException(
              { message: 'Email này đã được sử dụng' },
              HttpStatus.BAD_REQUEST,
            );
          }
          // step 2: mã hóa mật khẩu và lưu vào cơ sở dữ liệu
          const hashedPassword = await bcrypt.hash(updateUserDto.password, 10);
          const result = await this.prisma.user.update({
            where: { id: +id },
            data: { ...updateUserDto, password: hashedPassword, role: updateUserDto.role as Role, gender: updateUserDto.gender as Gender},
          });
          return result;
        }

    //Search users
    searchUsers = async (filters: UserNameSearchDto) => {
        const { name } = filters;
        const search = name || '';
        return this.prisma.user.findMany({
          where: { name: { contains: search } },
        });
    }
  
    //Upload avatar
    uploadAvatar = async (file: Express.Multer.File, userId: number) => {
        if (!file) {
            throw new BadRequestException('No file uploaded');
        }

        try {
            const avatarUrl = `uploads/avatars/${file.filename}`;
            
            const updatedUser = await this.prisma.user.update({
                where: { id: userId },
                data: {
                    avatar: avatarUrl,
                    updatedAt: new Date(),
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    avatar: true,
                },
            });

            return {
                message: 'Avatar uploaded successfully',
                user: updatedUser,
            };
        } catch (error) {
            console.error('Upload avatar error:', error);
            throw new BadRequestException('Failed to update avatar');
        }
    }
}
    