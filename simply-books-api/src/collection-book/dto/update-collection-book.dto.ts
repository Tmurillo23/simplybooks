import { PartialType } from '@nestjs/mapped-types';
import { CreateCollectionBookDto } from './create-collection-book.dto';

export class UpdateCollectionBookDto extends PartialType(CreateCollectionBookDto) {}
