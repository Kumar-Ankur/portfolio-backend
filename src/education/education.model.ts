import * as mongoose from 'mongoose';

export const EducationSchema = new mongoose.Schema({
  degree: String,
  institution: String,
  board: String,
  year: String,
  percentage: Number,
});

export interface EducationModel extends mongoose.Document {
  degree: string;
  institution: string;
  board: string;
  year: string;
  percentage: number;
}
