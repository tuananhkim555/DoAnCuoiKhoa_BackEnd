import { Injectable, NotFoundException, UnauthorizedException, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateCommentDto, UpdateCommentDto } from './dto/comment.dto';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { JsonWebTokenError } from 'jsonwebtoken';

@Injectable()
export class CommentService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  // Lấy tất cả bình luận
  findAll = async (req: Request) => {
    let { pageIndex, pageSize } = req.query as any;

    pageIndex = +pageIndex > 0 ? +pageIndex : 1; //chuỗi convert '' sang Number
    pageSize = +pageSize > 0 ? +pageSize : 3;

    const skip = (pageIndex - 1) * pageSize;
    const totalItems = await this.prisma.user.count();
    const totalPages = Math.ceil(totalItems / pageSize);
    // skip: (page -1) * pageSize,

const comments = await this.prisma.comment.findMany({
  take: pageSize, //Limit
  skip: skip, //Offset

  orderBy: {
    createdAt: 'desc',
  },
});

return {
      statusCode: 200,
      pageIndex: pageIndex,
      pageSize: pageSize,
      totalItems: totalItems,
      totalPages: totalPages,
      items: comments || [],
    };
  };

  // Tạo bình luận
  async createComment(createCommentDto: CreateCommentDto, req: Request) {
    // Kiểm tra user tồn tại
    const userExists = await this.prisma.user.findUnique({
      where: { id: createCommentDto.maNguoiBinhLuan }
    });

    if (!userExists) {
      throw new HttpException(
        { statusCode: 404, message: 'User not found' },
        HttpStatus.NOT_FOUND
      );
    }

    // Tạo comment mới với thông tin user
    const newComment = await this.prisma.comment.create({
      data: {
        userId: createCommentDto.maNguoiBinhLuan,
        roomId: createCommentDto.maPhong,
        content: createCommentDto.noiDung,
        rating: createCommentDto.saoBinhLuan,
        createdAt: new Date(),
      },
    });

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Comment created successfully',
      content: newComment,
    };
  }

  // Lấy bình luận theo mã phòng
  findByRoomId = async (maPhong: number, req: Request) => {
    let { pageIndex, pageSize } = req.query as any;

    pageIndex = +pageIndex > 0 ? +pageIndex : 1; //chuỗi convert '' sang Number
    pageSize = +pageSize > 0 ? +pageSize : 3;

    const skip = (pageIndex - 1) * pageSize;  
    const totalItems = await this.prisma.comment.count({
      where: { roomId: maPhong },
    });
    const totalPages = Math.ceil(totalItems / pageSize);
    // skip: (page -1) * pageSize,

const comments = await this.prisma.comment.findMany({
  take: pageSize, //Limit
  skip: skip, //Offset

  orderBy: {
    createdAt: 'desc',
  },
});

return {
      statusCode: 200,
      pageIndex: pageIndex,
      pageSize: pageSize,
      totalItems: totalItems,
      totalPages: totalPages,
      items: comments || [],
    };
  };

  // Update a comment
  async updateComment(id: number, updateCommentDto: UpdateCommentDto) {
    // Kiểm tra comment tồn tại
    const existingComment = await this.prisma.comment.findUnique({
      where: { id }
    });

    if (!existingComment) {
      throw new HttpException(
        { statusCode: 404, message: 'Comment not found' },
        HttpStatus.NOT_FOUND
      );
    }

    const comment = await this.prisma.comment.update({
      where: {
        id: id
      },
      data: {
        roomId: updateCommentDto.maPhong,
        userId: updateCommentDto.maNguoiBinhLuan,
        content: updateCommentDto.noiDung,
        rating: updateCommentDto.saoBinhLuan,
        updatedAt: new Date()
      }
    });

    return {
      statusCode: HttpStatus.OK,
      message: 'Comment updated successfully',
      content: comment
    };
  }
}
