import {
  Body,
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Patch,
} from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserModel } from './user.model';
import { UserDTO } from './users.dto';
import { UsersService } from './users.service';

@Controller('profile')
@ApiTags('Profile')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiCreatedResponse({
    description: 'User record has been successfully saved',
    type: UserDTO,
  })
  @ApiBody({
    required: true,
    type: UserDTO,
  })
  async addUserDetail(@Body() user: UserModel) {
    const { name, company, overview, description, experience, skills } = user;

    const newlyAddedUser = await this.usersService.insertUserDetail(
      name,
      company,
      overview,
      description,
      experience,
      skills,
    );

    return newlyAddedUser;
  }

  @Get()
  @ApiOkResponse({
    description: 'User record has been successfully fetched',
    type: [UserDTO],
  })
  async getUserData() {
    const response = await this.usersService.getUserData();
    return response;
  }

  @Patch(':id')
  @ApiCreatedResponse({
    description: 'User record has been successfully updated',
    type: UserDTO,
  })
  @ApiBody({
    required: true,
    type: UserDTO,
  })
  async updateUser(@Param('id') userId: string, @Body() user: UserModel) {
    const { name, company, overview, description, experience, skills } = user;
    const updatedUser = await this.usersService.updateUser(
      userId,
      name,
      company,
      overview,
      description,
      experience,
      skills,
    );
    return updatedUser as UserModel;
  }

  @Delete(':id')
  @ApiOkResponse()
  async deleteUser(@Param('id') userId: string) {
    const deleteUser = await this.usersService.deleteUser(userId);
    return { message: deleteUser };
  }
}
