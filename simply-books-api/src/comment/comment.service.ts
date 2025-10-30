import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
  ) {}

  async create(createCommentDto: CreateCommentDto) {
    try {
      const commentEntity = this.commentRepository.create(createCommentDto);
      await this.commentRepository.save(commentEntity);
      return commentEntity;
    } catch (error) {
      throw new BadRequestException('Could not create comment');
    }
  }

  findAll() {
    return this.commentRepository.find({ 
      relations: ['user', 'review', 'parent', 'replies'] 
    });
  }

  findOne(id: string) {
    return this.commentRepository.findOne({ 
      where: { id },
      relations: ['user', 'review', 'parent', 'replies'] 
    });
  }

  findByReview(reviewId: string) {
    return this.commentRepository.find({ 
      where: { reviewId },
      relations: ['user', 'review', 'parent', 'replies'] 
    });
  }

  findByUser(userId: string) {
    return this.commentRepository.find({ 
      where: { userId },
      relations: ['user', 'review', 'parent', 'replies'] 
    });
  }

  findByParent(parentId: string) {
    return this.commentRepository.find({ 
      where: { parentId },
      relations: ['user', 'review', 'parent', 'replies'] 
    });
  }

  async update(id: string, updateCommentDto: UpdateCommentDto) {
    await this.commentRepository.update(id, updateCommentDto);
    return this.findOne(id);
  }

  async remove(id: string) {
    return this.commentRepository.delete(id);
  }
}