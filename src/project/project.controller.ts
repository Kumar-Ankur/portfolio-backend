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

  @Post()
  @ApiCreatedResponse({
    description: 'Project has been added successfully',
    type: ProjectDTO,
  })
  @ApiBody({
    required: true,
    type: ProjectDTO,
  })
  async addNewProject(@Body() project: ProjectModel) {
    const { url, title, description, imageId } = project;
    const newProject = await this.projectService.saveNewProject(
      url,
      title,
      description,
      imageId,
    );
    return newProject;
  }

  @Get()
  @ApiOkResponse({
    description: 'Project data has been fetched successfully',
    type: [ProjectDTO],
  })
  async getProject() {
    const getProjectData = await this.projectService.getProject();
    return getProjectData;
  }

  @Get(':id')
  @ApiOkResponse({
    description: 'Project has been fetched successfully',
    type: ProjectDTO,
  })
  async getProjectById(@Param('id') projectId: string) {
    const project = await this.projectService.findProject(projectId);
    return project;
  }

  @Patch(':id')
  @ApiCreatedResponse({
    description: 'Project has been updated successfully',
    type: ProjectDTO,
  })
  @ApiBody({
    required: true,
    type: ProjectDTO,
  })
  async updateProject(
    @Param('id') projectId: string,
    @Body() project: ProjectModel,
  ) {
    const { url, title, description, imageId } = project;
    const updatedProject = await this.projectService.updateProject(
      projectId,
      url,
      title,
      description,
      imageId,
    );
    return updatedProject;
  }

  @Delete(':id')
  @ApiOkResponse({
    description: 'Project has been deleted successfully',
    type: ProjectDTO,
  })
  async deleteProject(@Param('id') projectId: string) {
    const project = await this.projectService.deleteProject(projectId);
    return {
      message: 'Project has been deleted successfully',
      project,
    };
  }
}
