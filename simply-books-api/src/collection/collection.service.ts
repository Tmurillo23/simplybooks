import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Collection } from './entities/collection.entity';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';

@Injectable()
export class CollectionService {
  constructor(
    @InjectRepository(Collection)
    private collectionRepository: Repository<Collection>,
  ) {}

  async create(createCollectionDto: CreateCollectionDto) {
    try {
      const collectionEntity = this.collectionRepository.create(createCollectionDto);
      await this.collectionRepository.save(collectionEntity);
      return collectionEntity;
    } catch (error) {
      throw new BadRequestException('Could not create collection');
    }
  }

  findAll() {
    return this.collectionRepository.find({ 
      relations: ['user', 'collectionBooks'] 
    });
  }

  findOne(id: number) {
    return this.collectionRepository.findOne({ 
      where: { id },
      relations: ['user', 'collectionBooks'] 
    });
  }

  findByUser(userId: number) {
    return this.collectionRepository.find({ 
      where: { userId },
      relations: ['user', 'collectionBooks'] 
    });
  }

  async update(id: number, updateCollectionDto: UpdateCollectionDto) {
    await this.collectionRepository.update(id, updateCollectionDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    return this.collectionRepository.delete(id);
  }
}