import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './entities/review.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
  ) {}

  async create(createReviewDto: CreateReviewDto) {
    try {
      const reviewEntity = this.reviewRepository.create(createReviewDto);
      await this.reviewRepository.save(reviewEntity);
      return reviewEntity;
    } catch (error) {
      throw new BadRequestException('Could not create review');
    }
  }

  findAll() {
    return this.reviewRepository.find({ 
      relations: ['user', 'book'] 
    });
  }

  findOne(id: string) {
    return this.reviewRepository.findOne({ 
      where: { id },
      relations: ['user', 'book'] 
    });
  }

  findByUser(userId: string) {
    return this.reviewRepository.find({ 
      where: { userId },
      relations: ['user', 'book'] 
    });
  }

  findByBook(bookId: string) {
    return this.reviewRepository.find({ 
      where: { bookId },
      relations: ['user', 'book'] 
    });
  }

  findByUserAndBook(userId: string, bookId: string) {
    return this.reviewRepository.findOne({ 
      where: { userId, bookId },
      relations: ['user', 'book'] 
    });
  }

  async update(id: string, updateReviewDto: UpdateReviewDto) {
    await this.reviewRepository.update(id, updateReviewDto);
    return this.findOne(id);
  }

  async remove(id: string) {
    return this.reviewRepository.delete(id);
  }
}