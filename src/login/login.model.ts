import * as mongoose from 'mongoose';

export const LoginSchema = new mongoose.Schema({
  userid: String,
  password: String,
});

export interface LoginModel extends mongoose.Document {
  userid: string;
  password: string;
}
