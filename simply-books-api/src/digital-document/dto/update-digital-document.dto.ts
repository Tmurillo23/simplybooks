import { PartialType } from '@nestjs/mapped-types';
import { CreateDigitalDocumentDto } from './create-digital-document.dto';

export class UpdateDigitalDocumentDto extends PartialType(CreateDigitalDocumentDto) {}
