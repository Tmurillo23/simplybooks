import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Follower } from './entities/follower.entity';
import { CreateFollowerDto } from './dto/create-follower.dto';

@Injectable()
export class FollowerService {
  constructor(
    @InjectRepository(Follower)
    private followerRepository: Repository<Follower>,
  ) {}

  async create(createFollowerDto: CreateFollowerDto) {
    try {
      const followerEntity = this.followerRepository.create(createFollowerDto);
      await this.followerRepository.save(followerEntity);
      return followerEntity;
    } catch (error) {
      throw new BadRequestException('Could not create follower relationship');
    }
  }

  findAll() {
    return this.followerRepository.find({ 
      relations: ['follower', 'followed'] 
    });
  }

  findFollowing(userId: number) {
    return this.followerRepository.find({ 
      where: { userId },
      relations: ['follower', 'followed'] 
    });
  }

  findFollowers(userId: number) {
    return this.followerRepository.find({ 
      where: { followedId: userId },
      relations: ['follower', 'followed'] 
    });
  }

  checkFollowing(userId: number, followedId: number) {
    return this.followerRepository.findOne({ 
      where: { userId, followedId },
      relations: ['follower', 'followed'] 
    });
  }

  async remove(userId: number, followedId: number) {
    return this.followerRepository.delete({ userId, followedId });
  }
}