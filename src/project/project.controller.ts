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
import { ProjectDTO } from './project.dto';
import { ProjectModel } from './project.model';
import { ProjectService } from './project.service';

@Controller('project')
@ApiTags('Project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post(':profileName')
  @ApiCreatedResponse({
    description: 'Project has been added successfully',
    type: ProjectDTO,
  })
  @ApiBody({
    required: true,
    type: ProjectDTO,
  })
  async addNewProject(
    @Param('profileName') profileName: string,
    @Body() project: ProjectModel,
  ) {
    const { url, title, description, imageId } = project;
    const newProject = await this.projectService.saveNewProject(
      profileName,
      url,
      title,
      description,
      imageId,
    );
    return newProject;
  }

  @Get(':profileName')
  @ApiOkResponse({
    description: 'Project data has been fetched successfully',
    type: [ProjectDTO],
  })
  async getProject(@Param('profileName') profileName: string) {
    const getProjectData = await this.projectService.getProject(profileName);
    return getProjectData;
  }

  @Patch(':profileName/:id')
  @ApiCreatedResponse({
    description: 'Project has been updated successfully',
    type: ProjectDTO,
  })
  @ApiBody({
    required: true,
    type: ProjectDTO,
  })
  async updateProject(
    @Param('profileName') profileName: string,
    @Param('id') projectId: string,
    @Body() project: ProjectModel,
  ) {
    const { url, title, description, imageId } = project;
    const updatedProject = await this.projectService.updateProject(
      profileName,
      projectId,
      url,
      title,
      description,
      imageId,
    );
    return updatedProject;
  }

  @Delete(':profileName/:id')
  @ApiOkResponse({
    description: 'Project has been deleted successfully',
    type: ProjectDTO,
  })
  async deleteProjectById(
    @Param('profileName') profileName: string,
    @Param('id') projectId: string,
  ) {
    const project = await this.projectService.deleteProjectById(
      profileName,
      projectId,
    );
    return project;
  }

  @Delete(':profileName')
  @ApiOkResponse({
    description: 'Project has been deleted successfully',
    type: ProjectDTO,
  })
  async deleteProject(@Param('profileName') profileName: string) {
    const project = await this.projectService.deleteProject(profileName);
    return project;
  }
}
