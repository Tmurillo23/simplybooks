import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Controller('v1/comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  create(@Body() createCommentDto: CreateCommentDto) {
    return this.commentService.create(createCommentDto);
  }

  @Get()
  findAll() {
    return this.commentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commentService.findOne(+id);
  }

  @Get('review/:reviewId')
  findByReview(@Param('reviewId') reviewId: string) {
    return this.commentService.findByReview(+reviewId);
  }

  @Get('user/:userId')
  findByUser(@Param('userId') userId: string) {
    return this.commentService.findByUser(+userId);
  }

  @Get('parent/:parentId')
  findByParent(@Param('parentId') parentId: string) {
    return this.commentService.findByParent(+parentId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto) {
    return this.commentService.update(+id, updateCommentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commentService.remove(+id);
  }
}