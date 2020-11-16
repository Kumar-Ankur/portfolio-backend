import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class OfficialDTO {
  @IsString()
  @ApiProperty()
  employer: string;

  @IsString()
  @ApiProperty()
  client: string;

  @IsString()
  @ApiProperty()
  projectDescription: string[];

  @IsString()
  @ApiProperty()
  role: string;

  @IsNumber()
  @ApiProperty()
  teamSize: number;

  @IsString()
  @ApiProperty()
  responsibility: string[];
}
