import { Body, Controller, Get, Param, Post } from '@nestjs/common';
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

  @Post(':profileName')
  @ApiCreatedResponse({
    description: 'Contact has been saved successfully',
    type: ContactDTO,
  })
  @ApiBody({
    required: true,
    type: ContactDTO,
  })
  async createNewContact(
    @Param('profileName') profileName: string,
    @Body() contact: ContactModel,
  ) {
    const { name, email, message } = contact;
    const newContact = await this.contactService.saveNewContact(
      profileName,
      name,
      email,
      message,
    );
    return newContact;
  }

  @Get(':profileName')
  @ApiOkResponse({
    description: 'Contact has been fetched successfully',
    type: [ContactDTO],
  })
  async getContact(@Param('profileName') profileName: string) {
    const getAllContact = await this.contactService.getContact(profileName);
    return getAllContact;
  }
}
