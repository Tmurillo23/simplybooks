import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Collection } from '../../collection/entities/collection.entity';
import { Book } from '../../book/entities/book.entity';

@Entity('collection_books')
export class CollectionBook {
  @PrimaryColumn()
  collectionId: string;

  @PrimaryColumn()
  bookId: string;

  @ManyToOne(() => Collection, collection => collection.collectionBooks)
  @JoinColumn({ name: 'collectionId' })
  collection: Collection;

  @ManyToOne(() => Book, book => book.collectionBooks)
  @JoinColumn({ name: 'bookId' })
  book: Book;
}