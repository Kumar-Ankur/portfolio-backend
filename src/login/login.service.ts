import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { MailerService } from '@nestjs-modules/mailer';
import { Model } from 'mongoose';
import { AuthService } from 'src/auth/auth.service';
import {
  LoginModel,
  RegisterResponseModel,
  RequestAccessModel,
} from './login.model';
import { check } from 'email-existence';

@Injectable()
export class LoginService {
  constructor(
    @InjectModel('Register')
    private readonly registerModel: Model<RegisterResponseModel>,
    @InjectModel('RequestAccess')
    private readonly requestAccessModel: Model<RequestAccessModel>,
    private authService: AuthService,
    private readonly mailerService: MailerService,
  ) {}

  async registerUser(
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    profileName: string,
  ) {
    const getLoginData = await this.findUserByEmail(email);
    if (getLoginData) {
      return {
        message: 'Email Id Already Registered, please login',
        status: 'fail',
      };
    }
    const passwordHash = await this.authService.hashPassword(password);
    const newRegister = new this.registerModel();
    newRegister.firstName = firstName.trim();
    newRegister.lastName = lastName.trim();
    newRegister.email = email;
    newRegister.password = passwordHash;
    newRegister.profileName = profileName.toLowerCase();
    const result = await newRegister.save();
    return {
      message:
        'Profile has been registered successfully, please login to complete your detail.',
      status: 'success',
      firstName: result.firstName,
      lastName: result.lastName,
      email: result.email,
      profileName: result.profileName,
      _id: result.id,
    };
  }

  async loginUser(loginData: LoginModel) {
    const { email, password } = loginData;
    const getLoggedInUser = await this.findUserByEmail(email);
    if (!getLoggedInUser) {
      return {
        message:
          'Email id does not exists, please register to access your dashboard.',
        status: 'fail',
      };
    }

    const isValidUser = await this.authService.comparePasswords(
      password,
      getLoggedInUser.password,
    );

    if (!isValidUser) {
      return {
        message: 'Invalid Credential, please try again with valid one.',
        status: 'fail',
      };
    }
    const generatedToken = await this.authService.generateJWT(loginData);
    return {
      access_token: generatedToken,
      status: 'success',
      message: 'User has been logged in successfully',
      userDetail: {
        firstName: getLoggedInUser.firstName,
        lastName: getLoggedInUser.lastName,
        email: getLoggedInUser.email,
        profileName: getLoggedInUser.profileName,
        profileImageId: getLoggedInUser.profileImageId,
      },
    };
  }

  async deleteLogin(email: string) {
    await this.registerModel.deleteOne({ email });
    return 'Record has been deleted successfully';
  }

  async updateLogin(
    emailId: string,
    firstname: string,
    lastname: string,
    email: string,
    password: string,
  ) {
    const loggedInUser = await this.findUserByEmail(emailId);
    if (firstname) {
      loggedInUser.firstName = firstname;
    }
    if (lastname) {
      loggedInUser.lastName = lastname;
    }
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

    const grantedMail = await this.sendGrantedAccessMail(email);
    if (grantedMail) {
      const updatedUser = await requestUser.save();
      return {
        message: 'Mail send successfully and Permission has been granted',
        user: updatedUser,
      };
    }
    return {
      message: 'Mail does not send, something went wrong',
      status: 'fail',
    };
  }

  async updateProfileImageId(email, imageId) {
    const getProfileUser = await this.findUserByEmail(email);
    if (imageId) {
      getProfileUser.profileImageId = imageId;
    }
    const saveRegisterDetail = await getProfileUser.save();
    return {
      message: 'Profile Image has been set successfully',
      profileImageId: saveRegisterDetail.profileImageId,
    };
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
      userData = await this.registerModel.findOne({ email });
    } catch {
      userData = '';
    }
    return userData;
  }

  async validateEmail(email: string) {
    const mailSend = new Promise((resolve, reject) => {
      check(email, (err, response) => {
        if (err) {
          reject(err);
        }
        resolve(response);
      });
    });

    return mailSend
      .then((res) => {
        return res as boolean;
      })
      .catch(() => {
        return false;
      });
  }

  async sendPermissionEmail(email: string) {
    return this.mailerService
      .sendMail({
        to: email,
        bcc: process.env.REQUEST_ACCESS_EMAIL,
        from: process.env.REQUEST_ACCESS_EMAIL,
        subject: 'Grant Permission to access PORTFOLIO Portal ✔',
        template: 'index',
      })
      .then(() => {
        return true;
      })
      .catch(() => {
        return false;
      });
  }

  async sendGrantedAccessMail(email: string) {
    return this.mailerService
      .sendMail({
        to: email,
        bcc: process.env.REQUEST_ACCESS_EMAIL,
        from: process.env.REQUEST_ACCESS_EMAIL,
        subject: 'Permission has been granted to PORTFOLIO Portal ✔',
        template: 'grantedMail',
      })
      .then(() => {
        return true;
      })
      .catch(() => {
        return false;
      });
  }

  async isProfileName(profileName: string) {
    let profile;
    try {
      profile = await this.registerModel.findOne({ profileName });
    } catch {
      profile = '';
    }
    return profile;
  }

  async getProfileName(firstName: string, lastName: string) {
    const profileName =
      firstName.toString().slice(0, 3) +
      lastName.toString().slice(0, 3) +
      ~~(Math.random() * 100);

    const isProfilePresent = await this.isProfileName(profileName);
    if (isProfilePresent) {
      return this.getProfileName(firstName, lastName);
    }
    return profileName;
  }
}
