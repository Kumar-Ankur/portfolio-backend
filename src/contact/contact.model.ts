import * as mongoose from 'mongoose';

export const ContactSchema = new mongoose.Schema({
  profileName: String,
  contact: {
    name: String,
    email: String,
    message: String,
  },
});

export interface ContactModel extends mongoose.Document {
  name: string;
  email: string;
  message: string;
}
