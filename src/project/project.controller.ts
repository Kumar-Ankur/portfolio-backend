import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Res,
  Param,
  HttpException,
  Get,
  HttpStatus,
  Delete,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiTags,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { ApiFile } from './apifile';
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

  @Post('/attachment/file')
  @ApiConsumes('multipart/form-data')
  @ApiFile('image')
  @UseInterceptors(FileInterceptor('image'))
  upload(@UploadedFile() file) {
    const response = [];
    const fileReponse = {
      originalname: file.originalname,
      encoding: file.encoding,
      mimetype: file.mimetype,
      id: file.id,
      filename: file.filename,
      metadata: file.metadata,
      bucketName: file.bucketName,
      chunkSize: file.chunkSize,
      size: file.size,
      md5: file.md5,
      uploadDate: file.uploadDate,
      contentType: file.contentType,
    };
    response.push(fileReponse);
    return response;
  }

  @Get('/attachment/info/:id')
  @ApiBadRequestResponse()
  async getFileInfo(@Param('id') id: string) {
    const file = await this.projectService.findInfo(id);
    const filestream = await this.projectService.readStream(id);
    if (!filestream) {
      throw new HttpException(
        'An error occurred while retrieving file info',
        HttpStatus.EXPECTATION_FAILED,
      );
    }
    return {
      message: 'File has been detected',
      file: file,
    };
  }

  @Get('/attachment/download/:id')
  @ApiBadRequestResponse()
  async downloadFile(@Param('id') id: string, @Res() res) {
    const file = await this.projectService.findInfo(id);
    const filestream = await this.projectService.readStream(id);
    if (!filestream) {
      throw new HttpException(
        'An error occurred while retrieving file',
        HttpStatus.EXPECTATION_FAILED,
      );
    }
    res.header('Content-Type', file.contentType);
    res.header('Content-Disposition', 'attachment; filename=' + file.filename);
    return filestream.pipe(res);
  }

  @Delete('/attachment/:id')
  @ApiBadRequestResponse()
  @ApiCreatedResponse()
  async deleteFile(@Param('id') id: string) {
    const file = await this.projectService.findInfo(id);
    const filestream = await this.projectService.deleteFile(id);
    if (!filestream) {
      throw new HttpException(
        'An error occurred during file deletion',
        HttpStatus.EXPECTATION_FAILED,
      );
    }
    return {
      message: 'File has been deleted',
      file: file,
    };
  }

  @Get('/attachment/file/:id')
  @ApiBadRequestResponse()
  async getFile(@Param('id') id: string, @Res() res) {
    const file = await this.projectService.findInfo(id);
    const filestream = await this.projectService.readStream(id);
    if (!filestream) {
      throw new HttpException(
        'An error occurred while retrieving file',
        HttpStatus.EXPECTATION_FAILED,
      );
    }
    res.header('Content-Type', file.contentType);
    return filestream.pipe(res);
  }
}
