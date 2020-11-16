import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ProjectDTO {
  @IsString()
  @ApiProperty()
  url: string;

  @IsString()
  @ApiProperty()
  title: string;
}

export class FileInfoVm {
  @ApiProperty()
  length: number;

  @ApiProperty()
  chunkSize: number;

  @ApiProperty()
  filename: string;

  @ApiProperty()
  md5: string;

  @ApiProperty()
  contentType: string;
}
