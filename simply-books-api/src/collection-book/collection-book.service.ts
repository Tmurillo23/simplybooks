import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CollectionBook } from './entities/collection-book.entity';
import { CreateCollectionBookDto } from './dto/create-collection-book.dto';

@Injectable()
export class CollectionBookService {
  constructor(
    @InjectRepository(CollectionBook)
    private collectionBookRepository: Repository<CollectionBook>,
  ) {}

  async create(createCollectionBookDto: CreateCollectionBookDto) {
    try {
      const collectionBookEntity = this.collectionBookRepository.create(createCollectionBookDto);
      await this.collectionBookRepository.save(collectionBookEntity);
      return collectionBookEntity;
    } catch (error) {
      throw new BadRequestException('Could not create collection book');
    }
  }

  findAll() {
    return this.collectionBookRepository.find({ 
      relations: ['collection', 'book'] 
    });
  }

  findByCollection(collectionId: string) {
    return this.collectionBookRepository.find({ 
      where: { collectionId },
      relations: ['collection', 'book'] 
    });
  }

  findByBook(bookId: string) {
    return this.collectionBookRepository.find({ 
      where: { bookId },
      relations: ['collection', 'book'] 
    });
  }

  async remove(collectionId: string, bookId: string) {
    return this.collectionBookRepository.delete({ collectionId, bookId });
  }
}