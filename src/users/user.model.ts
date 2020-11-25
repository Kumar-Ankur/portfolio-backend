import * as mongoose from 'mongoose';

export const ProfileSchema = new mongoose.Schema({
  profileName: String,
  profile: {
    name: String,
    company: String,
    overview: String,
    description: String,
    experience: Number,
    skills: [String],
  },
});

export interface ProfileModel extends mongoose.Document {
  name: string;
  company: string;
  overview: string;
  description: string;
  experience: number;
  skills: string[];
}
