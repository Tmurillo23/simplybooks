import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Review } from '../../review/entities/review.entity';

@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  text: string;

  @Column({ type: 'date' })
  date: Date;

  @ManyToOne(() => User, user => user.comments)
  user: User;

  @Column()
  userId: number;

  @ManyToOne(() => Review, review => review.comments)
  review: Review;

  @Column()
  reviewId: number;

  @ManyToOne(() => Comment, comment => comment.replies, { nullable: true })
  parent: Comment;

  @Column({ nullable: true })
  parentId: number;

  @OneToMany(() => Comment, comment => comment.parent)
  replies: Comment[];
}
