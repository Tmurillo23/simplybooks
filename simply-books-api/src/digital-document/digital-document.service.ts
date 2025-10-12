import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DigitalDocument } from './entities/digital-document.entity';
import { CreateDigitalDocumentDto } from './dto/create-digital-document.dto';
import { UpdateDigitalDocumentDto } from './dto/update-digital-document.dto';

@Injectable()
export class DigitalDocumentService {
  constructor(
    @InjectRepository(DigitalDocument)
    private digitalDocumentRepository: Repository<DigitalDocument>,
  ) {}

  async create(createDigitalDocumentDto: CreateDigitalDocumentDto) {
    try {
      const documentEntity = this.digitalDocumentRepository.create(createDigitalDocumentDto);
      await this.digitalDocumentRepository.save(documentEntity);
      return documentEntity;
    } catch (error) {
      throw new BadRequestException('Could not create digital document');
    }
  }

  findAll() {
    return this.digitalDocumentRepository.find({ 
      relations: ['user'] 
    });
  }

  findOne(id: number) {
    return this.digitalDocumentRepository.findOne({ 
      where: { id },
      relations: ['user'] 
    });
  }

  findByUser(userId: number) {
    return this.digitalDocumentRepository.find({ 
      where: { userId },
      relations: ['user'] 
    });
  }

  async update(id: number, updateDigitalDocumentDto: UpdateDigitalDocumentDto) {
    await this.digitalDocumentRepository.update(id, updateDigitalDocumentDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    return this.digitalDocumentRepository.delete(id);
  }
}