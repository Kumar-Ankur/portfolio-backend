import * as mongoose from 'mongoose';

export const RequestAccessSchema = new mongoose.Schema({
  email: String,
  status: String,
  isAdmin: Boolean,
});

export const RegisterSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  profileName: String,
  profileImageId: String,
});

export interface RegisterRequestModel extends mongoose.Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  profileImageId: string;
}

export interface RegisterResponseModel extends mongoose.Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  profileName: string;
  profileImageId: string;
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
