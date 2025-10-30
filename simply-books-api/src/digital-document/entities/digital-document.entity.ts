import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity('digital_documents')
export class DigitalDocument {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column()
  name: string;

  @Column()
  format: string;

  @Column()
  file_path: string;

  @ManyToOne(() => User, user => user.digital_documents)
  user: User;

  @Column()
  userId: string;
}
