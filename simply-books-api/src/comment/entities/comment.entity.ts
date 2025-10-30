import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Review } from '../../review/entities/review.entity';

@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column('text')
  text: string;

  @Column({ type: 'date' })
  date: Date;

  @ManyToOne(() => User, user => user.comments)
  user: User;

  @Column()
  userId: string;

  @ManyToOne(() => Review, review => review.comments)
  review: Review;

  @Column()
  reviewId: string;

  @ManyToOne(() => Comment, comment => comment.replies, { nullable: true })
  parent: Comment;

  @Column({ nullable: true })
  parentId: string;

  @OneToMany(() => Comment, comment => comment.parent)
  replies: Comment[];
}
