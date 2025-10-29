import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { DigitalDocumentService } from './digital-document.service';
import { CreateDigitalDocumentDto } from './dto/create-digital-document.dto';
import { UpdateDigitalDocumentDto } from './dto/update-digital-document.dto';
import { RoleGuard } from 'src/security/role/role.guard';
import { AuthGuard } from 'src/security/auth/auth.guard';

@Controller('v1/digital-documents')
export class DigitalDocumentController {
  constructor(private readonly digitalDocumentService: DigitalDocumentService) {}

  @Post()
  @UseGuards(RoleGuard)
  create(@Body() createDigitalDocumentDto: CreateDigitalDocumentDto) {
    return this.digitalDocumentService.create(createDigitalDocumentDto);
  }

  @Get()
  @UseGuards(AuthGuard)
  findAll() {
    return this.digitalDocumentService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: string) {
    return this.digitalDocumentService.findOne(+id);
  }

  @Get('user/:userId')
  @UseGuards(AuthGuard)
  findByUser(@Param('userId') userId: string) {
    return this.digitalDocumentService.findByUser(+userId);
  }

  @Patch(':id')
  @UseGuards(RoleGuard)
  update(@Param('id') id: string, @Body() updateDigitalDocumentDto: UpdateDigitalDocumentDto) {
    return this.digitalDocumentService.update(+id, updateDigitalDocumentDto);
  }

  @Delete(':id')
  @UseGuards(RoleGuard)
  remove(@Param('id') id: string) {
    return this.digitalDocumentService.remove(+id);
  }
}