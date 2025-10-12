import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DigitalDocumentService } from './digital-document.service';
import { CreateDigitalDocumentDto } from './dto/create-digital-document.dto';
import { UpdateDigitalDocumentDto } from './dto/update-digital-document.dto';

@Controller('v1/digital-documents')
export class DigitalDocumentController {
  constructor(private readonly digitalDocumentService: DigitalDocumentService) {}

  @Post()
  create(@Body() createDigitalDocumentDto: CreateDigitalDocumentDto) {
    return this.digitalDocumentService.create(createDigitalDocumentDto);
  }

  @Get()
  findAll() {
    return this.digitalDocumentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.digitalDocumentService.findOne(+id);
  }

  @Get('user/:userId')
  findByUser(@Param('userId') userId: string) {
    return this.digitalDocumentService.findByUser(+userId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDigitalDocumentDto: UpdateDigitalDocumentDto) {
    return this.digitalDocumentService.update(+id, updateDigitalDocumentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.digitalDocumentService.remove(+id);
  }
}