import { Controller, Get, Post, Body, Param, Delete, UseGuards } from '@nestjs/common';
import { CollectionBookService } from './collection-book.service';
import { CreateCollectionBookDto } from './dto/create-collection-book.dto';
import { RoleGuard } from 'src/security/role/role.guard';
import { AuthGuard } from 'src/security/auth/auth.guard';

@Controller('v1/collection-books')
export class CollectionBookController {
  constructor(private readonly collectionBookService: CollectionBookService) {}

  @Post()
  @UseGuards(RoleGuard)
  create(@Body() createCollectionBookDto: CreateCollectionBookDto) {
    return this.collectionBookService.create(createCollectionBookDto);
  }

  @Get()
  @UseGuards(AuthGuard)
  findAll() {
    return this.collectionBookService.findAll();
  }

  @Get('collection/:collectionId')
  @UseGuards(AuthGuard)
  findByCollection(@Param('collectionId') collectionId: string) {
    return this.collectionBookService.findByCollection(+collectionId);
  }

  @Get('book/:bookId')
  @UseGuards(AuthGuard)
  findByBook(@Param('bookId') bookId: string) {
    return this.collectionBookService.findByBook(+bookId);
  }

  @Delete('collection/:collectionId/book/:bookId')
  @UseGuards(RoleGuard)
  remove(
    @Param('collectionId') collectionId: string,
    @Param('bookId') bookId: string,
  ) {
    return this.collectionBookService.remove(+collectionId, +bookId);
  }
}