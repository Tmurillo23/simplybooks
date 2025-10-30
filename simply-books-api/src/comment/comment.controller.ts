import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { RoleGuard } from 'src/security/role/role.guard';
import { AuthGuard } from 'src/security/auth/auth.guard';

@Controller('v1/comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  @UseGuards(RoleGuard)
  create(@Body() createCommentDto: CreateCommentDto) {
    return this.commentService.create(createCommentDto);
  }

  @Get()
  @UseGuards(AuthGuard)
  findAll() {
    return this.commentService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: string) {
    return this.commentService.findOne(id);
  }

  @Get('review/:reviewId')
  @UseGuards(AuthGuard)
  findByReview(@Param('reviewId') reviewId: string) {
    return this.commentService.findByReview(reviewId);
  }

  @Get('user/:userId')
  @UseGuards(AuthGuard)
  findByUser(@Param('userId') userId: string) {
    return this.commentService.findByUser(userId);
  }

  @Get('parent/:parentId')
  @UseGuards(AuthGuard)
  findByParent(@Param('parentId') parentId: string) {
    return this.commentService.findByParent(parentId);
  }

  @Patch(':id')
  @UseGuards(RoleGuard)
  update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto) {
    return this.commentService.update(id, updateCommentDto);
  }

  @Delete(':id')
  @UseGuards(RoleGuard)
  remove(@Param('id') id: string) {
    return this.commentService.remove(id);
  }
}