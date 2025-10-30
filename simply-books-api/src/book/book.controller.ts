import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { RoleGuard } from 'src/security/role/role.guard';
import { AuthGuard } from 'src/security/auth/auth.guard';

@Controller('v1/books')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post()
  @UseGuards(RoleGuard)
  create(@Body() createBookDto: CreateBookDto) {
    return this.bookService.create(createBookDto);
  }

  @Get()
  @UseGuards(AuthGuard)
  findAll() {
    return this.bookService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: string) {
    return this.bookService.findOne(id);
  }

  @Get('user/:userId')
  @UseGuards(AuthGuard)
  findByUser(@Param('userId') userId: string) {
    return this.bookService.findByUser(userId);
  }

  @Get('isbn/:isbn')
  @UseGuards(AuthGuard)
  findByIsbn(@Param('isbn') isbn: string) {
    return this.bookService.findByIsbn(isbn);
  }

  @Patch(':id')
  @UseGuards(RoleGuard)
  update(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto) {
    return this.bookService.update(id, updateBookDto);
  }

  @Delete(':id')
  @UseGuards(RoleGuard)
  remove(@Param('id') id: string) {
    return this.bookService.remove(id);
  }
}