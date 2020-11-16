import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class EducationDTO {
  @ApiProperty()
  @IsString()
  degree: string;

  @ApiProperty()
  @IsString()
  institution: string;

  @ApiProperty()
  @IsString()
  board: string;

  @ApiProperty()
  @IsString()
  year: string;

  @ApiProperty()
  @IsString()
  percentage: number;
}
