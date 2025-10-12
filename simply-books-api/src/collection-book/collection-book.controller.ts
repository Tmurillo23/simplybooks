import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { CollectionBookService } from './collection-book.service';
import { CreateCollectionBookDto } from './dto/create-collection-book.dto';

@Controller('v1/collection-books')
export class CollectionBookController {
  constructor(private readonly collectionBookService: CollectionBookService) {}

  @Post()
  create(@Body() createCollectionBookDto: CreateCollectionBookDto) {
    return this.collectionBookService.create(createCollectionBookDto);
  }

  @Get()
  findAll() {
    return this.collectionBookService.findAll();
  }

  @Get('collection/:collectionId')
  findByCollection(@Param('collectionId') collectionId: string) {
    return this.collectionBookService.findByCollection(+collectionId);
  }

  @Get('book/:bookId')
  findByBook(@Param('bookId') bookId: string) {
    return this.collectionBookService.findByBook(+bookId);
  }

  @Delete('collection/:collectionId/book/:bookId')
  remove(
    @Param('collectionId') collectionId: string,
    @Param('bookId') bookId: string,
  ) {
    return this.collectionBookService.remove(+collectionId, +bookId);
  }
}