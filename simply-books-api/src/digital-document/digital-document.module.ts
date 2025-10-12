import { Module } from '@nestjs/common';
import { DigitalDocumentService } from './digital-document.service';
import { DigitalDocumentController } from './digital-document.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DigitalDocument } from './entities/digital-document.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DigitalDocument])],
  controllers: [DigitalDocumentController],
  providers: [DigitalDocumentService],
})
export class DigitalDocumentModule {}
