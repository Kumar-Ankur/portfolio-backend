import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginDTO {
  @IsString()
  @ApiProperty()
  userid: string;

  @IsString()
  @ApiProperty()
  password: string;
}
