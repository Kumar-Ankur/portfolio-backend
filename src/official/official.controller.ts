import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { OfficialDTO } from './official.dto';
import { OfficialModel } from './official.model';
import { OfficialService } from './official.service';

@Controller('official')
@ApiTags('Official Project')
export class OfficialController {
  constructor(private readonly officialService: OfficialService) {}

  @Post(':profileName')
  @ApiOkResponse({
    description: 'Official Project has been added successfully',
    type: OfficialDTO,
  })
  @ApiBody({
    required: true,
    type: OfficialDTO,
  })
  async insertOfficialProject(
    @Param('profileName') profileName: string,
    @Body() project: OfficialModel,
  ) {
    const {
      employer,
      client,
      projectDescription,
      role,
      teamSize,
      responsibility,
    } = project;
    const newProject = await this.officialService.insertOfficialProject(
      profileName,
      employer,
      client,
      projectDescription,
      role,
      teamSize,
      responsibility,
    );
    return newProject;
  }

  @Get(':profileName')
  @ApiOkResponse({
    description: 'Official project fetched successfully',
    type: OfficialDTO,
  })
  async getOfficialProject(@Param('profileName') profileName: string) {
    const fetchedProject = await this.officialService.fetchedProject(
      profileName,
    );
    return fetchedProject;
  }

  @Delete(':profileName/:id')
  @ApiOkResponse({
    description: 'Official Prpject has been deleted successfully',
  })
  async deleteOfficialProjectById(
    @Param('profileName') profileName: string,
    @Param('id') projectId: string,
  ) {
    const deleteProject = await this.officialService.deleteOfficialProjectById(
      profileName,
      projectId,
    );
    return deleteProject;
  }

  @Delete(':profileName')
  @ApiOkResponse({
    description: 'Official Prpject has been deleted successfully',
  })
  async deleteOfficialProject(@Param('profileName') profileName: string) {
    const deleteProject = await this.officialService.deleteOfficialProject(
      profileName,
    );
    return deleteProject;
  }

  @Patch(':profileName/:id')
  @ApiOkResponse({
    description: 'Official project has been updated successfully',
    type: OfficialDTO,
  })
  @ApiBody({
    required: true,
    type: OfficialDTO,
  })
  async updateProject(
    @Body() project: OfficialModel,
    @Param('id') projectId: string,
    @Param('profileName') profileName: string,
  ) {
    const {
      employer,
      client,
      projectDescription,
      role,
      teamSize,
      responsibility,
    } = project;
    const updatedResult = await this.officialService.updateProject(
      profileName,
      projectId,
      employer,
      client,
      projectDescription,
      role,
      teamSize,
      responsibility,
    );
    return updatedResult;
  }
}
