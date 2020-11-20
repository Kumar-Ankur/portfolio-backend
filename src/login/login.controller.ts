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
import { LoginDTO } from './login.dto';
import { LoginModel } from './login.model';
import { LoginService } from './login.service';

@Controller('login')
@ApiTags('Login')
export class AuthController {
  constructor(private readonly loginService: LoginService) {}

  @Post()
  @ApiCreatedResponse({
    description: 'Login credential has been added successfully',
    type: LoginDTO,
  })
  @ApiBody({
    required: true,
    type: LoginDTO,
  })
  async insertLoginCredential(@Body() login: LoginModel) {
    const { userid, password } = login;
    const createdLogin = await this.loginService.createdLogin(userid, password);
    return createdLogin;
  }

  @Get()
  @ApiOkResponse({
    description: 'Login data fetched successfully',
    type: [LoginDTO],
  })
  async getLoginData() {
    const loginData = await this.loginService.getLoginData();
    return loginData;
  }

  @Delete(':id')
  @ApiOkResponse({
    description: 'Login Credential has been deleted successfully',
  })
  async deleteLogin(@Param('id') loginId: string) {
    const deleteLogin = await this.loginService.deleteLogin(loginId);
    return {
      message: deleteLogin,
    };
  }

  @Patch(':id')
  @ApiOkResponse({
    description: 'Login credential has been updated successfully',
    type: LoginDTO,
  })
  @ApiBody({
    required: true,
    type: LoginDTO,
  })
  async updateLoginCredential(
    @Param('id') loginId: string,
    @Body() login: LoginModel,
  ) {
    const { userid, password } = login;
    const updatedLoginCredential = await this.loginService.updateLogin(
      loginId,
      userid,
      password,
    );
    return updatedLoginCredential;
  }
}
