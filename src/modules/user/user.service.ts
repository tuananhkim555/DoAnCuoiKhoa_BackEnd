import { PrismaService } from '../../prisma.service';
import { Injectable } from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { UserCreateDto } from './dto/user-create.dto';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAllUsers(): Promise<User[]> {
    return await this.prismaService.user.findMany();
  }

  async createUser(userData: UserCreateDto): Promise<User> {
    return await this.prismaService.user.create({ data: userData });
  }

  async deleteUser(id: number): Promise<void> {
    await this.prismaService.user.delete({ where: { id } });
  }

  async paginateAndSearch(query: any): Promise<User[]> {
    const { page = 1, limit = 10, search } = query;

    return await this.prismaService.user.findMany({
      where: {
        name: search ? { contains: search } : undefined,
      },
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  async getUserById(id: number): Promise<User> {
    return await this.prismaService.user.findUnique({ where: { id } });
  }

  async updateUser(id: number, userData: UserDto): Promise<User> {
    return await this.prismaService.user.update({
      where: {
        id,
      },
      data: +userData,
    });
  }

  async searchUserByName(name: string): Promise<User[]> {
    return this.prismaService.user.findMany({
      where: { name: { contains: name } },
    });
  }

  async uploadAvatar(body: any): Promise<any> {
    // Logic xử lý upload
    return {};
  }
}
