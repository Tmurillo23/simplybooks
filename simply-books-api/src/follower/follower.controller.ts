import { Controller, Get, Post, Body, Param, Delete, UseGuards } from '@nestjs/common';
import { FollowerService } from './follower.service';
import { CreateFollowerDto } from './dto/create-follower.dto';
import { RoleGuard } from 'src/security/role/role.guard';
import { AuthGuard } from 'src/security/auth/auth.guard';

@Controller('v1/followers')
export class FollowerController {
  constructor(private readonly followerService: FollowerService) {}

  @Post()
  @UseGuards(RoleGuard)
  create(@Body() createFollowerDto: CreateFollowerDto) {
    return this.followerService.create(createFollowerDto);
  }

  @Get()
  @UseGuards(AuthGuard)
  findAll() {
    return this.followerService.findAll();
  }

  @Get('user/:userId/following')
  @UseGuards(AuthGuard)
  findFollowing(@Param('userId') userId: string) {
    return this.followerService.findFollowing(+userId);
  }

  @Get('user/:userId/followers')
  @UseGuards(AuthGuard)
  findFollowers(@Param('userId') userId: string) {
    return this.followerService.findFollowers(+userId);
  }

  @Get('user/:userId/following/:followedId')
  @UseGuards(AuthGuard)
  checkFollowing(
    @Param('userId') userId: string,
    @Param('followedId') followedId: string,
  ) {
    return this.followerService.checkFollowing(+userId, +followedId);
  }

  @Delete('user/:userId/following/:followedId')
  @UseGuards(RoleGuard)
  remove(
    @Param('userId') userId: string,
    @Param('followedId') followedId: string,
  ) {
    return this.followerService.remove(+userId, +followedId);
  }
}