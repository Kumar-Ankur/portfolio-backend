import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LoginModel } from './login.model';

@Injectable()
export class LoginService {
  constructor(
    @InjectModel('Login') private readonly loginModel: Model<LoginModel>,
  ) {}

  async createdLogin(userid: string, password: string) {
    const newLogin = new this.loginModel({ userid, password });
    const result = newLogin.save();
    return result;
  }

  async getLoginData() {
    const getData = await this.loginModel.find();
    return getData;
  }

  async deleteLogin(loginId: string) {
    await this.loginModel.deleteOne({ _id: loginId });
    return 'Authentication data has been deleted successfully';
  }

  async updateLogin(loginId: string, userid: string, password: string) {
    const login = await this.findLogin(loginId);
    if (userid) {
      login.userid = userid;
    }
    if (password) {
      login.password = password;
    }
    const updatedLogin = await login.save();
    return updatedLogin;
  }

  async findLogin(id: string) {
    let login;
    try {
      login = await this.loginModel.findById(id);
    } catch {
      throw new NotFoundException('could not find the Login detail');
    }
    if (!login) {
      throw new NotFoundException('could not find the Login detail');
    }
    return login;
  }
}
