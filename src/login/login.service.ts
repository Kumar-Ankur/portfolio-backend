import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuthService } from 'src/auth/auth.service';
import { LoginModel, RegisterModel, RequestAccessModel } from './login.model';

@Injectable()
export class LoginService {
  constructor(
    @InjectModel('Login') private readonly registerModel: Model<RegisterModel>,
    @InjectModel('Login') private readonly loginModel: Model<LoginModel>,
    @InjectModel('RequestAccess')
    private readonly requestAccessModel: Model<RequestAccessModel>,
    private authService: AuthService,
  ) {}

  async registerUser(userid: string, pass: string, email: string) {
    const getLoginData = await this.findUserByEmail(email);
    if (getLoginData) {
      return {
        message: 'Email Id Already Registered',
      };
    }
    const passwordHash = await this.authService.hashPassword(pass);
    const newLogin = new this.registerModel();
    newLogin.userid = userid;
    newLogin.password = passwordHash;
    newLogin.email = email;
    const result = await newLogin.save();
    return {
      message: 'User credential has been saved successfully',
      userid: result.userid,
      email: result.email,
      _id: result.id,
    };
  }

  async loginUser(loginData: LoginModel) {
    const { email, password } = loginData;
    const getLoggedInUser = await this.findUserByEmail(email);
    if (!getLoggedInUser) {
      return {
        message: 'Email id does not exists, please register',
      };
    }

    const isValidUser = await this.authService.comparePasswords(
      password,
      getLoggedInUser.password,
    );

    if (!isValidUser) {
      return {
        message: 'Wrong Credentail',
      };
    }
    const generatedToken = await this.authService.generateJWT(loginData);
    return {
      access_token: generatedToken,
    };
  }

  async deleteLogin(email: string) {
    await this.loginModel.deleteOne({ email });
    return 'Record has been deleted successfully';
  }

  async updateLogin(emailId: string, email: string, password: string) {
    const loggedInUser = await this.findUserByEmail(emailId);
    if (email) {
      loggedInUser.email = email;
    }
    if (password) {
      loggedInUser.password = password;
    }
    const updatedLoginUser = await loggedInUser.save();
    return {
      _id: updatedLoginUser.id,
      email: updatedLoginUser.email,
    };
  }

  async requestAccessPermission(
    email: string,
    status: string,
    isAdmin: boolean,
  ) {
    const newRequest = new this.requestAccessModel({
      email,
      status,
      isAdmin,
    });
    const requestAccess = await newRequest.save();
    return requestAccess;
  }

  async getInActiveUser() {
    const allRequestUser = await this.requestAccessModel.find();
    console.log(allRequestUser);
    return allRequestUser.filter((user) => user.status === 'In_Active');
  }

  async updateRequestUserStatus(
    email: string,
    status: string,
    isAdmin: boolean,
  ) {
    const requestUser = await this.findRequestEmail(email);
    if (email) {
      requestUser.email = email;
    }
    if (status) {
      requestUser.status = status;
    }
    if (isAdmin) {
      requestUser.isAdmin = isAdmin;
    }

    const updatedUser = await requestUser.save();
    return updatedUser;
  }

  async findRequestEmail(email: string) {
    let userData;
    try {
      userData = await this.requestAccessModel.findOne({ email });
    } catch {
      userData = '';
    }
    return userData;
  }

  async findUserByEmail(email: string) {
    let userData;
    try {
      userData = await this.loginModel.findOne({ email });
    } catch {
      userData = '';
    }
    return userData;
  }
}
