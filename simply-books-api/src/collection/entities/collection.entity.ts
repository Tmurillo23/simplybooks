import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { CollectionBook } from '../../collection-book/entities/collection-book.entity';

@Entity('collections')
export class Collection {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column()
  name: string;

  @Column('text', { nullable: true })
  description: string;

  @ManyToOne(() => User, user => user.collections)
  user: User;

  @Column()
  userId: string;

  @OneToMany(() => CollectionBook, collectionBook => collectionBook.collection)
  collectionBooks: CollectionBook[];
}
