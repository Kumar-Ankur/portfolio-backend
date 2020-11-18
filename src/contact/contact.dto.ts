import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class ContactDTO {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsEmail()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  message: string;
}
