import * as mongoose from 'mongoose';

export const LoginSchema = new mongoose.Schema({
  userid: String,
  password: String,
  email: String,
});

export interface RegisterModel extends mongoose.Document {
  userid: string;
  password: string;
  email: string;
}

export interface LoginModel extends mongoose.Document {
  password: string;
  email: string;
}
