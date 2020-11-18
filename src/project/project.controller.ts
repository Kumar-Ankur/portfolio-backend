import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
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
    const { url, title } = project;
    console.log(url, title);
  }
}
