import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './entities/book.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book)
    private bookRepository: Repository<Book>,
  ) {}

  async create(createBookDto: CreateBookDto) {
    try {
      const bookEntity = this.bookRepository.create(createBookDto);
      await this.bookRepository.save(bookEntity);
      return bookEntity;
    } catch (error) {
      throw new BadRequestException('Could not create book');
    }
  }

  findAll() {
    return this.bookRepository.find({ relations: ['user'] });
  }

  findOne(id: number) {
    return this.bookRepository.findOne({ 
      where: { id },
      relations: ['user'] 
    });
  }

  findByUser(userId: number) {
    return this.bookRepository.find({ 
      where: { userId },
      relations: ['user'] 
    });
  }

  findByIsbn(isbn: string) {
    return this.bookRepository.findOne({ 
      where: { isbn },
      relations: ['user'] 
    });
  }

  async update(id: number, updateBookDto: UpdateBookDto) {
    await this.bookRepository.update(id, updateBookDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    return this.bookRepository.delete(id);
  }
}