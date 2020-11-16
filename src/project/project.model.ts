import * as mongoose from 'mongoose';

export const ProjectSchema = new mongoose.Schema({
  url: String,
  title: String,
});

export interface ProjectModel extends mongoose.Document {
  url: string;
  title: string;
}
