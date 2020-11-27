import * as mongoose from 'mongoose';

export const ProjectSchema = new mongoose.Schema({
  profileName: String,
  project: [
    {
      url: String,
      title: String,
      description: String,
      imageId: String,
    },
  ],
});

export interface ProjectModel extends mongoose.Document {
  url: string;
  title: string;
  description: string;
  imageId: string;
}
