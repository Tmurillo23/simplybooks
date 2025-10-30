import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity('followers')
export class Follower {
  @PrimaryColumn()
  userId: string;

  @PrimaryColumn()
  followedId: string;

  @ManyToOne(() => User, user => user.following)
  @JoinColumn({ name: 'userId' })
  follower: User;

  @ManyToOne(() => User, user => user.followers)
  @JoinColumn({ name: 'followedId' })
  followed: User;
}
