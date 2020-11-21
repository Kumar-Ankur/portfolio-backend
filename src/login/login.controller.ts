import { Body, Controller, Delete, Param, Patch, Post } from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { LoginDTO } from './login.dto';
import { LoginModel, RegisterModel } from './login.model';
import { LoginService } from './login.service';

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
