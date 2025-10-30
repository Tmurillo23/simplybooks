import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Loan } from './entities/loan.entity';
import { CreateLoanDto } from './dto/create-loan.dto';
import { UpdateLoanDto } from './dto/update-loan.dto';

@Injectable()
export class LoanService {
  constructor(
    @InjectRepository(Loan)
    private loanRepository: Repository<Loan>,
  ) {}

  async create(createLoanDto: CreateLoanDto) {
    try {
      const loanEntity = this.loanRepository.create(createLoanDto);
      await this.loanRepository.save(loanEntity);
      return loanEntity;
    } catch (error) {
      throw new BadRequestException('Could not create loan');
    }
  }

  findAll() {
    return this.loanRepository.find({ 
      relations: ['user', 'book'] 
    });
  }

  findOne(id: string) {
    return this.loanRepository.findOne({ 
      where: { id },
      relations: ['user', 'book'] 
    });
  }

  findByUser(userId: string) {
    return this.loanRepository.find({ 
      where: { userId },
      relations: ['user', 'book'] 
    });
  }

  findByBook(bookId: string) {
    return this.loanRepository.find({ 
      where: { bookId },
      relations: ['user', 'book'] 
    });
  }

  async update(id: string, updateLoanDto: UpdateLoanDto) {
    await this.loanRepository.update(id, updateLoanDto);
    return this.findOne(id);
  }

  async remove(id: string) {
    return this.loanRepository.delete(id);
  }
}