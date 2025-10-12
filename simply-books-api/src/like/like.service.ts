import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Like } from './entities/like.entity';
import { CreateLikeDto } from './dto/create-like.dto';

@Injectable()
export class LikeService {
  constructor(
    @InjectRepository(Like)
    private likeRepository: Repository<Like>,
  ) {}

  async create(createLikeDto: CreateLikeDto) {
    try {
      const likeEntity = this.likeRepository.create(createLikeDto);
      await this.likeRepository.save(likeEntity);
      return likeEntity;
    } catch (error) {
      throw new BadRequestException('Could not create like');
    }
  }

  findAll() {
    return this.likeRepository.find({ 
      relations: ['user', 'review'] 
    });
  }

  findByReview(reviewId: number) {
    return this.likeRepository.find({ 
      where: { reviewId },
      relations: ['user', 'review'] 
    });
  }

  findByUser(userId: number) {
    return this.likeRepository.find({ 
      where: { userId },
      relations: ['user', 'review'] 
    });
  }

  checkLike(userId: number, reviewId: number) {
    return this.likeRepository.findOne({ 
      where: { userId, reviewId },
      relations: ['user', 'review'] 
    });
  }

  async remove(userId: number, reviewId: number) {
    return this.likeRepository.delete({ userId, reviewId });
  }
}