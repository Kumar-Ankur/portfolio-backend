import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ContactModel } from './contact.model';

@Injectable()
export class ContactService {
  constructor(
    @InjectModel('contact') private readonly contactModel: Model<ContactModel>,
  ) {}

  async saveNewContact(
    profileName: string,
    name: string,
    email: string,
    message: string,
  ) {
    const contactDetail: any = await this.contactModel.findOne({
      profileName,
    });
    const contactObj = {
      name,
      email,
      message,
    };
    if (!contactDetail) {
      const newContact = new this.contactModel({
        profileName,
        contact: [contactObj],
      });
      const result = await newContact.save();
      return result;
    } else {
      contactDetail.contact = [...contactDetail.contact, contactObj];
      const result = await contactDetail.save();
      return result;
    }
  }

  async getContact(profileName: string) {
    const contactDetail: any = await this.contactModel.findOne({
      profileName,
    });
    if (!contactDetail) {
      return {
        status: 'fail',
        message: `no project detail found for this ${profileName} profile`,
      };
    }
    return contactDetail;
  }
}
