import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RegisterDTO, RequestAccessDTO, VerifyEmailDTO } from './login.dto';
import {
  LoginModel,
  RegisterRequestModel,
  VerifyEmailModel,
} from './login.model';
import { LoginService } from './login.service';

enum REQUEST_STATUS {
  IN_ACTIVE = 'In_Active',
  ACTIVE = 'active',
}
@Controller('user')
@ApiTags('User')
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  @Post('/verify')
  @ApiOkResponse({
    description: 'Email has been verified successfully',
    type: VerifyEmailDTO,
  })
  @ApiBody({
    required: true,
    type: VerifyEmailDTO,
  })
  async verifyEmailId(@Body() body: VerifyEmailModel) {
    const { email } = body;
    const verifyEmail = await this.loginService.findRequestEmail(email);
    if (!verifyEmail) {
      return {
        status: false,
        message:
          'Email does not exists, please click on request access button for getting permission',
      };
    }
    if (verifyEmail.status === REQUEST_STATUS.IN_ACTIVE) {
      return {
        status: false,
        message: 'Request already raised, still not approved by Admin',
      };
    }
    return {
      email: verifyEmail,
      status: true,
    };
  }

  @Post('/request')
  @ApiCreatedResponse({
    description: 'Access has been granted successfully',
    type: RequestAccessDTO,
  })
  @ApiBody({
    required: true,
    type: VerifyEmailDTO,
  })
  async requestAccessPermission(@Body() body: VerifyEmailModel) {
    const { email } = body;
    const verifyEmail = await this.loginService.findRequestEmail(email);
    if (verifyEmail) {
      return {
        message: 'Email id already exixts',
        status: verifyEmail.status,
      };
    }

    const isValidEmail = await this.loginService.validateEmail(email);
    if (!isValidEmail) {
      return {
        message: 'Email is not valid, please check once',
        status: 'fail',
      };
    }
    const sendMail = await this.loginService.sendPermissionEmail(email);
    if (!sendMail) {
      return {
        message:
          'Grant Permission Email did not send to Admin, please try after sometime',
        status: 'fail',
      };
    }
    const status = REQUEST_STATUS.IN_ACTIVE;
    const newRequest = await this.loginService.requestAccessPermission(
      email,
      status,
      false,
    );
    return {
      message: 'Mail has been send successfully',
      data: newRequest,
    };
  }

  @Post('/register')
  @ApiCreatedResponse({
    description: 'Login credential has been added successfully',
    type: RegisterDTO,
  })
  @ApiBody({
    required: true,
    type: RegisterDTO,
  })
  async insertLoginCredential(@Body() register: RegisterRequestModel) {
    const { firstName, lastName, email, password } = register;
    const profileName = await this.loginService.getProfileName(
      firstName,
      lastName,
    );
    const registeredUser = await this.loginService.registerUser(
      firstName,
      lastName,
      email,
      password,
      profileName,
    );
    return registeredUser;
  }

  @Get('/getinactiveuser')
  @ApiOkResponse({
    description: 'In Active User has been fetched successfully',
    type: [RequestAccessDTO],
  })
  async getInActiveUser() {
    return await this.loginService.getInActiveUser();
  }

  @Post('/login')
  @ApiOkResponse({
    description: 'Access token has been fetched successfully',
    type: String,
  })
  @ApiBody({
    required: true,
    type: RegisterDTO,
  })
  async loginUser(@Body() loginData: RegisterRequestModel) {
    const loggedInUser = await this.loginService.loginUser(loginData);
    return loggedInUser;
  }

  @Patch('/updatepermission')
  @ApiOkResponse({
    description: 'Access has been granted successfully',
    type: RequestAccessDTO,
  })
  @ApiBody({
    required: true,
    type: VerifyEmailDTO,
  })
  async updateAccessRequest(@Body() body: LoginModel) {
    const { email } = body;
    const status = REQUEST_STATUS.ACTIVE;
    const updatedPermission = await this.loginService.updateRequestUserStatus(
      email,
      status,
      false,
    );
    return updatedPermission;
  }

  @Delete(':email')
  @ApiOkResponse({
    description: 'Login Credential has been deleted successfully',
  })
  async deleteLogin(@Param('email') email: string) {
    const deleteLogin = await this.loginService.deleteLogin(email);
    return {
      message: deleteLogin,
    };
  }

  @Patch(':email')
  @ApiOkResponse({
    description: 'User detail has been updated successfully',
    type: RegisterDTO,
  })
  @ApiBody({
    required: true,
    type: RegisterDTO,
  })
  async updateLoginCredential(
    @Param('email') emailId: string,
    @Body() login: RegisterDTO,
  ) {
    const { firstName, lastName, email, password } = login;
    const updatedLoginCredential = await this.loginService.updateLogin(
      emailId,
      firstName,
      lastName,
      email,
      password,
    );
    return updatedLoginCredential;
  }
}
