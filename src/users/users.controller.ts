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
import { ProfileModel } from './user.model';
import { UserDTO } from './users.dto';
import { UsersService } from './users.service';

@Controller('profile')
@ApiTags('Profile')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post(':profileName')
  @ApiCreatedResponse({
    description: 'User record has been successfully saved',
    type: UserDTO,
  })
  @ApiBody({
    required: true,
    type: UserDTO,
  })
  async addUserDetail(
    @Param('profileName') profileName: string,
    @Body() user: ProfileModel,
  ) {
    const { name, company, overview, description, experience, skills } = user;

    const newlyAddedUser = await this.usersService.insertUserDetail(
      profileName,
      name,
      company,
      overview,
      description,
      experience,
      skills,
    );

    return newlyAddedUser;
  }

  @Get(':profileName')
  @ApiOkResponse({
    description: 'User record has been successfully fetched',
    type: UserDTO,
  })
  async getUserData(@Param('profileName') profileName: string) {
    const response = await this.usersService.getUserData(profileName);
    return response;
  }

  @Patch(':profileName')
  @ApiCreatedResponse({
    description: 'User record has been successfully updated',
    type: UserDTO,
  })
  @ApiBody({
    required: true,
    type: UserDTO,
  })
  async updateUser(
    @Param('profileName') profileName: string,
    @Body() user: ProfileModel,
  ) {
    const { name, company, overview, description, experience, skills } = user;
    const updatedUser = await this.usersService.updateUser(
      profileName,
      name,
      company,
      overview,
      description,
      experience,
      skills,
    );
    return updatedUser as ProfileModel;
  }

  @Delete(':profileName')
  @ApiOkResponse()
  async deleteUser(@Param('profileName') profileName: string) {
    const deleteUser = await this.usersService.deleteUser(profileName);
    return deleteUser;
  }
}
