import * as mongoose from 'mongoose';

export const OfficialSchema = new mongoose.Schema({
  employer: String,
  client: String,
  projectDescription: [String],
  role: String,
  teamSize: Number,
  responsibility: [String],
});

export interface OfficialModel extends mongoose.Document {
  employer: string;
  client: string;
  projectDescription: string[];
  role: string;
  teamSize: number;
  responsibility: string[];
}
