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
import { AuthDTO } from './auth.dto';
import { AuthModel } from './auth.model';
import { AuthService } from './auth.service';

@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  @ApiCreatedResponse({
    description: 'Authentication credential has been added successfully',
    type: AuthDTO,
  })
  @ApiBody({
    required: true,
    type: AuthDTO,
  })
  async insertAuthCredential(@Body() auth: AuthModel) {
    const { userid, password } = auth;
    const createdAuth = await this.authService.createdAuth(userid, password);
    return createdAuth;
  }

  @Get()
  @ApiOkResponse({
    description: 'Authentication data fetched successfully',
    type: [AuthDTO],
  })
  async getAuth() {
    const AuthData = await this.authService.getAuthData();
    return AuthData;
  }

  @Delete(':id')
  @ApiOkResponse({
    description: 'Auth has been deleted successfully',
  })
  async deleteAuth(@Param('id') authId: string) {
    const delAuth = await this.authService.deleteAuth(authId);
    return {
      message: delAuth,
    };
  }

  @Patch(':id')
  @ApiOkResponse({
    description: 'Auth has been updated successfully',
    type: AuthDTO,
  })
  @ApiBody({
    required: true,
    type: AuthDTO,
  })
  async updateAuth(@Param('id') authId: string, @Body() auth: AuthModel) {
    const { userid, password } = auth;
    const updatedAuth = await this.authService.updateAuth(
      authId,
      userid,
      password,
    );
    return updatedAuth;
  }
}
