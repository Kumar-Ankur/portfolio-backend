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

  @Post()
  @ApiOkResponse({
    description: 'Official Project has been added successfully',
    type: OfficialDTO,
  })
  @ApiBody({
    required: true,
    type: OfficialDTO,
  })
  async insertOfficialProject(@Body() project: OfficialModel) {
    const {
      employer,
      client,
      projectDescription,
      role,
      teamSize,
      responsibility,
    } = project;
    const newProject = await this.officialService.insertOfficialProject(
      employer,
      client,
      projectDescription,
      role,
      teamSize,
      responsibility,
    );
    return newProject;
  }

  @Get()
  @ApiOkResponse({
    description: 'Official project fetched successfully',
    type: [OfficialDTO],
  })
  async getOfficialProject() {
    const fetchedProject = await this.officialService.fetchedProject();
    return fetchedProject;
  }

  @Delete(':id')
  @ApiOkResponse({
    description: 'Official Prpject has been deleted successfully',
  })
  async deleteOfficialProject(@Param('id') projectId: string) {
    const deleteProject = await this.officialService.deleteOfficialProject(
      projectId,
    );
    return {
      message: deleteProject,
    };
  }

  @Patch(':id')
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
