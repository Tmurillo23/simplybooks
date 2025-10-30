import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Review } from '../../review/entities/review.entity';

@Entity('likes')
export class Like {
  @PrimaryColumn()
  userId: string;

  @PrimaryColumn()
  reviewId: string;

  @ManyToOne(() => User, user => user.likes)
  @JoinColumn({ name: 'userId' }) 
  user: User;

  @ManyToOne(() => Review, review => review.likes)
  @JoinColumn({ name: 'reviewId' })
  review: Review;
}
