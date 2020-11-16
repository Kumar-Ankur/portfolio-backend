import * as mongoose from 'mongoose';

export const AuthSchema = new mongoose.Schema({
  userid: String,
  password: String,
});

export interface AuthModel extends mongoose.Document {
  userid: string;
  password: string;
}
