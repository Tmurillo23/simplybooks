import { Entity, PrimaryGeneratedColumn, Column, OneToMany, BeforeInsert, BeforeUpdate } from 'typeorm';
import { Book } from '../../book/entities/book.entity';
import { Review } from '../../review/entities/review.entity';
import { Comment } from '../../comment/entities/comment.entity';
import { Like } from '../../like/entities/like.entity';
import { Collection } from '../../collection/entities/collection.entity';
import { Loan } from '../../loan/entities/loan.entity';
import { DigitalDocument } from '../../digital-document/entities/digital-document.entity';
import { Follower } from '../../follower/entities/follower.entity';
import { Progress } from '../../progress/entities/progress.entity';
import bcrypt from "bcryptjs";

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  avatar: string;


  @Column({ nullable: true })
  biography: string;

  @Column({ default: 0 })
  books_read: number;

  @Column({ default: 0 })
  reviews_written: number;

  @Column({ default: 0 })
  followers_count: number;

  @Column({ default: 0 })
  following_count: number;

  @OneToMany(() => Book, book => book.user)
  books: Book[];

  @OneToMany(() => Review, review => review.user)
  reviews: Review[];

  @OneToMany(() => Comment, comment => comment.user)
  comments: Comment[];

  @OneToMany(() => Like, like => like.user)
  likes: Like[];

  @OneToMany(() => Collection, collection => collection.user)
  collections: Collection[];

  @OneToMany(() => Loan, loan => loan.user)
  loans: Loan[];

  @OneToMany(() => DigitalDocument, document => document.user)
  digital_documents: DigitalDocument[];

  @OneToMany(() => Follower, follower => follower.follower)
  following: Follower[];

  @OneToMany(() => Follower, follower => follower.followed)
  followers: Follower[];

  @OneToMany(() => Progress, progress => progress.user)
  progress: Progress[];

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }
}
