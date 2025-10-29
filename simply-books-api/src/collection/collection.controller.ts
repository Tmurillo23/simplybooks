import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CollectionService } from './collection.service';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import { RoleGuard } from 'src/security/role/role.guard';
import { AuthGuard } from 'src/security/auth/auth.guard';

@Controller('v1/collections')
export class CollectionController {
  constructor(private readonly collectionService: CollectionService) {}

  @Post()
  @UseGuards(RoleGuard)
  create(@Body() createCollectionDto: CreateCollectionDto) {
    return this.collectionService.create(createCollectionDto);
  }

  @Get()
  @UseGuards(AuthGuard)
  findAll() {
    return this.collectionService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: string) {
    return this.collectionService.findOne(+id);
  }

  @Get('user/:userId')
  @UseGuards(AuthGuard)
  findByUser(@Param('userId') userId: string) {
    return this.collectionService.findByUser(+userId);
  }

  @Patch(':id')
  @UseGuards(RoleGuard)
  update(@Param('id') id: string, @Body() updateCollectionDto: UpdateCollectionDto) {
    return this.collectionService.update(+id, updateCollectionDto);
  }

  @Delete(':id')
  @UseGuards(RoleGuard)
  remove(@Param('id') id: string) {
    return this.collectionService.remove(+id);
  }
}