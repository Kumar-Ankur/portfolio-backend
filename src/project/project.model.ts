import * as mongoose from 'mongoose';
import * as GridfsStorage from 'multer-gridfs-storage';

export const ProjectSchema = new mongoose.Schema({
  url: String,
  title: String,
  imageId: String,
});

export interface ProjectModel extends mongoose.Document {
  url: string;
  title: string;
  imageId: string;
}
