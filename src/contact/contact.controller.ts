import { Body, Controller, Get, Post } from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ContactDTO } from './contact.dto';
import { ContactModel } from './contact.model';
import { ContactService } from './contact.service';

@Controller('contact')
@ApiTags('Contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  @ApiCreatedResponse({
    description: 'Contact has been saved successfully',
    type: ContactDTO,
  })
  @ApiBody({
    required: true,
    type: ContactDTO,
  })
  async createNewContact(@Body() contact: ContactModel) {
    const { name, email, message } = contact;
    const newContact = await this.contactService.saveNewContact(
      name,
      email,
      message,
    );
    return newContact;
  }

  @Get()
  @ApiOkResponse({
    description: 'Contact has been fetched successfully',
    type: [ContactDTO],
  })
  async getContact() {
    const getAllContact = await this.contactService.getContact();
    return getAllContact;
  }
}
