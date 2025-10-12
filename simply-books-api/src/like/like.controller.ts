import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { LikeService } from './like.service';
import { CreateLikeDto } from './dto/create-like.dto';

@Controller('v1/likes')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @Post()
  create(@Body() createLikeDto: CreateLikeDto) {
    return this.likeService.create(createLikeDto);
  }

  @Get()
  findAll() {
    return this.likeService.findAll();
  }

  @Get('review/:reviewId')
  findByReview(@Param('reviewId') reviewId: string) {
    return this.likeService.findByReview(+reviewId);
  }

  @Get('user/:userId')
  findByUser(@Param('userId') userId: string) {
    return this.likeService.findByUser(+userId);
  }

  @Get('user/:userId/review/:reviewId')
  checkLike(@Param('userId') userId: string, @Param('reviewId') reviewId: string) {
    return this.likeService.checkLike(+userId, +reviewId);
  }

  @Delete('user/:userId/review/:reviewId')
  remove(@Param('userId') userId: string, @Param('reviewId') reviewId: string) {
    return this.likeService.remove(+userId, +reviewId);
  }
}