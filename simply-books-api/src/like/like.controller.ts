import { Controller, Get, Post, Body, Param, Delete, UseGuards } from '@nestjs/common';
import { LikeService } from './like.service';
import { CreateLikeDto } from './dto/create-like.dto';
import { RoleGuard } from 'src/security/role/role.guard';
import { AuthGuard } from 'src/security/auth/auth.guard';

@Controller('v1/likes')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @Post()
  @UseGuards(RoleGuard)
  create(@Body() createLikeDto: CreateLikeDto) {
    return this.likeService.create(createLikeDto);
  }

  @Get()
  @UseGuards(AuthGuard)
  findAll() {
    return this.likeService.findAll();
  }

  @Get('review/:reviewId')
  @UseGuards(AuthGuard)
  findByReview(@Param('reviewId') reviewId: string) {
    return this.likeService.findByReview(+reviewId);
  }

  @Get('user/:userId')
  @UseGuards(AuthGuard)
  findByUser(@Param('userId') userId: string) {
    return this.likeService.findByUser(+userId);
  }

  @Get('user/:userId/review/:reviewId')
  @UseGuards(AuthGuard)
  checkLike(@Param('userId') userId: string, @Param('reviewId') reviewId: string) {
    return this.likeService.checkLike(+userId, +reviewId);
  }

  @Delete('user/:userId/review/:reviewId')
  @UseGuards(RoleGuard)
  remove(@Param('userId') userId: string, @Param('reviewId') reviewId: string) {
    return this.likeService.remove(+userId, +reviewId);
  }
}