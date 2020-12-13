import {
  Controller,
  UploadedFile,
  UseInterceptors,
  Res,
  Param,
  HttpException,
  Get,
  HttpStatus,
  Delete,
  Post,
  Patch,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiConsumes,
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { ApiFile } from './apifile';
import { ImageService } from './image.service';

@Controller('image')
@ApiTags('Image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Post('/attachment/file')
  @ApiConsumes('multipart/form-data')
  @ApiFile('image')
  @UseInterceptors(FileInterceptor('image'))
  upload(@UploadedFile() file) {
    const response = [];
    const fileReponse = {
      originalname: file.originalname || '',
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

  @Patch('/attachment/file/:id')
  @ApiConsumes('multipart/form-data')
  @ApiFile('image')
  @UseInterceptors(FileInterceptor('image'))
  async updateImage(@Param('id') imageId: string, @UploadedFile() file) {
    const ImageInfo = await this.imageService.findInfo(imageId);
    const filestream = await this.imageService.deleteFile(imageId);
    if (!filestream) {
      throw new HttpException(
        'An error occurred while updating image',
        HttpStatus.EXPECTATION_FAILED,
      );
    }
    const response = [];
    const fileReponse = {
      originalname: file.originalname,
      encoding: file.encoding,
      mimetype: file.mimetype,
      id: ImageInfo.id,
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
    const file = await this.imageService.findInfo(id);
    const filestream = await this.imageService.readStream(id);
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

  @Get('/attachment/image')
  @ApiOkResponse({
    description: 'Image data has been fetched successfully',
  })
  async getImageData() {
    const img = await this.imageService.getImageData();
    return img;
  }

  @Get('/attachment/download/:id')
  @ApiBadRequestResponse()
  async downloadFile(@Param('id') id: string, @Res() res) {
    const file = await this.imageService.findInfo(id);
    const filestream = await this.imageService.readStream(id);
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
    const file = await this.imageService.findInfo(id);
    const filestream = await this.imageService.deleteFile(id);
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
    const file = await this.imageService.findInfo(id);
    const filestream = await this.imageService.readStream(id);
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
