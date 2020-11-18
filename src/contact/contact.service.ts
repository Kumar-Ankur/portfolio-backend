import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ContactModel } from './contact.model';

@Injectable()
export class ContactService {
  constructor(
    @InjectModel('contact') private readonly contactModel: Model<ContactModel>,
  ) {}

  async saveNewContact(name: string, email: string, message: string) {
    const newContact = new this.contactModel({
      name,
      email,
      message,
    });
    const createNewContact = await newContact.save();
    return createNewContact;
  }

  async getContact() {
    return await this.contactModel.find();
  }
}
