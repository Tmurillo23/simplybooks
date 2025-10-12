import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { BookModule } from './book/book.module';
import { ReviewModule } from './review/review.module';
import { CommentModule } from './comment/comment.module';
import { LikeModule } from './like/like.module';
import { CollectionModule } from './collection/collection.module';
import { CollectionBookModule } from './collection-book/collection-book.module';
import { LoanModule } from './loan/loan.module';
import { DigitalDocumentModule } from './digital-document/digital-document.module';
import { FollowerModule } from './follower/follower.module';
import { ProgressModule } from './progress/progress.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT!,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      autoLoadEntities:true,
      synchronize: true,
    }),
    UserModule,
    BookModule,
    ReviewModule,
    CommentModule,
    LikeModule,
    CollectionModule,
    CollectionBookModule,
    LoanModule,
    DigitalDocumentModule,
    FollowerModule,
    ProgressModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
