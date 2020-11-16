import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Mode } from 'fs';
import { Model } from 'mongoose';
import { AuthModel } from './auth.model';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('Auth') private readonly authModel: Model<AuthModel>,
  ) {}

  async createdAuth(userid: string, password: string) {
    const newAuth = new this.authModel({ userid, password });
    const result = newAuth.save();
    return result;
  }

  async getAuthData() {
    const getData = await this.authModel.find();
    return getData;
  }

  async deleteAuth(authId: string) {
    await this.authModel.deleteOne({ _id: authId });
    return 'Authentication data has been deleted successfully';
  }

  async updateAuth(authId: string, userid: string, password: string) {
    const auth = await this.findAuth(authId);
    if (userid) {
      auth.userid = userid;
    }
    if (password) {
      auth.password = password;
    }
    const updatedAuth = await auth.save();
    return updatedAuth;
  }

  async findAuth(id: string) {
    let auth;
    try {
      auth = await this.authModel.findById(id);
    } catch {
      throw new NotFoundException('could not find the authorization detail');
    }
    if (!auth) {
      throw new NotFoundException('could not find the authorization detail');
    }
    return auth;
  }
}
