import * as mongoose from 'mongoose';

export const UserScheme = new mongoose.Schema({
  name: String,
  company: String,
  overview: String,
  description: String,
  experience: Number,
});

export interface UserModel extends mongoose.Document {
  name: string;
  company: string;
  overview: string;
  description: string;
  experience: number;
  skills: string[];
}
