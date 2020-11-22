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
import { LoginDTO, RequestAccessDTO, VerifyEmailDTO } from './login.dto';
import {
  LoginModel,
  RegisterModel,
  RequestAccessModel,
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

  @Post('/register')
  @ApiCreatedResponse({
    description: 'Login credential has been added successfully',
    type: LoginDTO,
  })
  @ApiBody({
    required: true,
    type: LoginDTO,
  })
  async insertLoginCredential(@Body() register: RegisterModel) {
    const { userid, password, email } = register;
    const registeredUser = await this.loginService.registerUser(
      userid,
      password,
      email,
    );
    return registeredUser;
  }

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
    const status = REQUEST_STATUS.IN_ACTIVE;
    const newRequest = await this.loginService.requestAccessPermission(
      email,
      status,
      false,
    );

    // todo  - mail send to admin for granting permission to respective email id
    return newRequest;
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
    type: LoginDTO,
  })
  async loginUser(@Body() loginData: LoginModel) {
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
    description: 'Login credential has been updated successfully',
    type: LoginDTO,
  })
  @ApiBody({
    required: true,
    type: LoginDTO,
  })
  async updateLoginCredential(
    @Param('email') emailId: string,
    @Body() login: LoginModel,
  ) {
    const { email, password } = login;
    const updatedLoginCredential = await this.loginService.updateLogin(
      emailId,
      email,
      password,
    );
    return updatedLoginCredential;
  }
}
