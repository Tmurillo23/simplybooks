import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { RoleGuard } from 'src/security/role/role.guard';
import { AuthGuard } from 'src/security/auth/auth.guard';

@Controller('v1/reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  @UseGuards(RoleGuard)
  create(@Body() createReviewDto: CreateReviewDto) {
    return this.reviewService.create(createReviewDto);
  }

  @Get()
  @UseGuards(AuthGuard)
  findAll() {
    return this.reviewService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: string) {
    return this.reviewService.findOne(id);
  }

  @Get('user/:userId')
  @UseGuards(AuthGuard)
  findByUser(@Param('userId') userId: string) {
    return this.reviewService.findByUser(userId);
  }

  @Get('book/:bookId')
  @UseGuards(AuthGuard)
  findByBook(@Param('bookId') bookId: string) {
    return this.reviewService.findByBook(bookId);
  }

  @Get('user/:userId/book/:bookId')
  @UseGuards(AuthGuard)
  findByUserAndBook(@Param('userId') userId: string, @Param('bookId') bookId: string) {
    return this.reviewService.findByUserAndBook(userId, bookId);
  }

  @Patch(':id')
  @UseGuards(RoleGuard)
  update(@Param('id') id: string, @Body() updateReviewDto: UpdateReviewDto) {
    return this.reviewService.update(id, updateReviewDto);
  }

  @Delete(':id')
  @UseGuards(RoleGuard)
  remove(@Param('id') id: string) {
    return this.reviewService.remove(id);
  }
}