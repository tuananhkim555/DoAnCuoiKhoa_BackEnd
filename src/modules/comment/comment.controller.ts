import { Controller, Get, Post, Body, Param, ParseIntPipe, Req, Put, Delete } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto, UpdateCommentDto } from './dto/comment.dto';
import { PrismaService } from '../../common/prisma/prisma.service';
import { ApiBearerAuth, ApiOperation, ApiTags, ApiResponse, ApiHeader } from '@nestjs/swagger';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Public } from 'src/common/decorater/public.decorator';

@ApiTags('Comment')
@Controller('/api/comment')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class CommentController {
  constructor(
    private readonly commentService: CommentService,
    private prisma: PrismaService
  ) {}
  
  // Get all comments
  @Get()
  findAll(@Req() req: Request) {
    return this.commentService.findAll(req as any);
  }

  // Create a new comment
  @Public()
  @Post('')
  @ApiHeader({
    name: 'accessToken',
    required: true,
    description: 'Access token for authentication'
  })
  @ApiOperation({ summary: 'Create a new comment' })
  @ApiResponse({ status: 200, description: 'Comment created successfully' })
  create(@Body() createCommentDto: CreateCommentDto, @Req() req: Request) {
    return this.commentService.createComment(createCommentDto, req as any);
  }

  // Get comments by room id
  @Get('room/:maPhong')
  findByRoomId(@Param('maPhong', ParseIntPipe) maPhong: number, @Req() req: Request) {
    return this.commentService.findByRoomId(maPhong, req as any);
  }

  // Get all rooms
  @Get('rooms')
  async getRooms() {
    const rooms = await this.prisma.room.findMany({
      select: {
        id: true,
        name: true,
      }
    });
    return {
      statusCode: 200,
      content: rooms
    };
  }

  // Update a comment
  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateCommentDto: UpdateCommentDto) {
    return this.commentService.updateComment(id, updateCommentDto);
  }

  // Delete a comment
  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.commentService.deleteComment(id);
  }
}
