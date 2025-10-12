import { Module } from '@nestjs/common';
import { CollectionBookService } from './collection-book.service';
import { CollectionBookController } from './collection-book.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CollectionBook } from './entities/collection-book.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CollectionBook])],
  controllers: [CollectionBookController],
  providers: [CollectionBookService],
})
export class CollectionBookModule {}
