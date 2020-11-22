import * as mongoose from 'mongoose';

export const LoginSchema = new mongoose.Schema({
  userid: String,
  password: String,
  email: String,
});

export const RequestAccessSchema = new mongoose.Schema({
  email: String,
  status: String,
  isAdmin: Boolean,
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

export interface VerifyEmailModel extends mongoose.Document {
  email: string;
}

export interface RequestAccessModel extends mongoose.Document {
  email: string;
  status: string;
  isAdmin: boolean;
}
