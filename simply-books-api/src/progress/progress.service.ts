import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Progress } from './entities/progress.entity';
import { CreateProgressDto } from './dto/create-progress.dto';
import { UpdateProgressDto } from './dto/update-progress.dto';

@Injectable()
export class ProgressService {
  constructor(
    @InjectRepository(Progress)
    private progressRepository: Repository<Progress>,
  ) {}

  async create(createProgressDto: CreateProgressDto) {
    try {
      const progressEntity = this.progressRepository.create(createProgressDto);
      await this.progressRepository.save(progressEntity);
      return progressEntity;
    } catch (error) {
      throw new BadRequestException('Could not create progress');
    }
  }

  findAll() {
    return this.progressRepository.find({ 
      relations: ['user', 'book'] 
    });
  }

  findOne(id: number) {
    return this.progressRepository.findOne({ 
      where: { id },
      relations: ['user', 'book'] 
    });
  }

  findByUser(userId: number) {
    return this.progressRepository.find({ 
      where: { userId },
      relations: ['user', 'book'] 
    });
  }

  findByBook(bookId: number) {
    return this.progressRepository.find({ 
      where: { bookId },
      relations: ['user', 'book'] 
    });
  }

  findByUserAndBook(userId: number, bookId: number) {
    return this.progressRepository.findOne({ 
      where: { userId, bookId },
      relations: ['user', 'book'] 
    });
  }

  async update(id: number, updateProgressDto: UpdateProgressDto) {
    await this.progressRepository.update(id, updateProgressDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    return this.progressRepository.delete(id);
  }
}