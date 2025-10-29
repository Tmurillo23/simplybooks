import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ProgressService } from './progress.service';
import { CreateProgressDto } from './dto/create-progress.dto';
import { UpdateProgressDto } from './dto/update-progress.dto';
import { RoleGuard } from 'src/security/role/role.guard';
import { AuthGuard } from 'src/security/auth/auth.guard';

@Controller('v1/progress')
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Post()
  @UseGuards(RoleGuard)
  create(@Body() createProgressDto: CreateProgressDto) {
    return this.progressService.create(createProgressDto);
  }

  @Get()
  @UseGuards(AuthGuard)
  findAll() {
    return this.progressService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: string) {
    return this.progressService.findOne(+id);
  }

  @Get('user/:userId')
  @UseGuards(AuthGuard)
  findByUser(@Param('userId') userId: string) {
    return this.progressService.findByUser(+userId);
  }

  @Get('book/:bookId')
  @UseGuards(AuthGuard)
  findByBook(@Param('bookId') bookId: string) {
    return this.progressService.findByBook(+bookId);
  }

  @Get('user/:userId/book/:bookId')
  @UseGuards(AuthGuard)
  findByUserAndBook(@Param('userId') userId: string, @Param('bookId') bookId: string) {
    return this.progressService.findByUserAndBook(+userId, +bookId);
  }

  @Patch(':id')
  @UseGuards(RoleGuard)
  update(@Param('id') id: string, @Body() updateProgressDto: UpdateProgressDto) {
    return this.progressService.update(+id, updateProgressDto);
  }

  @Delete(':id')
  @UseGuards(RoleGuard)
  remove(@Param('id') id: string) {
    return this.progressService.remove(+id);
  }
}