import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { FollowerService } from './follower.service';
import { CreateFollowerDto } from './dto/create-follower.dto';

@Controller('v1/followers')
export class FollowerController {
  constructor(private readonly followerService: FollowerService) {}

  @Post()
  create(@Body() createFollowerDto: CreateFollowerDto) {
    return this.followerService.create(createFollowerDto);
  }

  @Get()
  findAll() {
    return this.followerService.findAll();
  }

  @Get('user/:userId/following')
  findFollowing(@Param('userId') userId: string) {
    return this.followerService.findFollowing(+userId);
  }

  @Get('user/:userId/followers')
  findFollowers(@Param('userId') userId: string) {
    return this.followerService.findFollowers(+userId);
  }

  @Get('user/:userId/following/:followedId')
  checkFollowing(
    @Param('userId') userId: string,
    @Param('followedId') followedId: string,
  ) {
    return this.followerService.checkFollowing(+userId, +followedId);
  }

  @Delete('user/:userId/following/:followedId')
  remove(
    @Param('userId') userId: string,
    @Param('followedId') followedId: string,
  ) {
    return this.followerService.remove(+userId, +followedId);
  }
}
