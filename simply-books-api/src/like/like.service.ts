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

  findByReview(reviewId: string) {
    return this.likeRepository.find({ 
      where: { reviewId },
      relations: ['user', 'review'] 
    });
  }

  findByUser(userId: string) {
    return this.likeRepository.find({ 
      where: { userId },
      relations: ['user', 'review'] 
    });
  }

  checkLike(userId: string, reviewId: string) {
    return this.likeRepository.findOne({ 
      where: { userId, reviewId },
      relations: ['user', 'review'] 
    });
  }

  async remove(userId: string, reviewId: string) {
    return this.likeRepository.delete({ userId, reviewId });
  }
}