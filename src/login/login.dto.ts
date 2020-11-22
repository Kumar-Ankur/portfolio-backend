import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginDTO {
  @IsString()
  @ApiProperty()
  userid: string;

  @IsString()
  @ApiProperty()
  password: string;

  @IsString()
  @ApiProperty()
  email: string;
}

export class VerifyEmailDTO {
  @IsString()
  @ApiProperty()
  email: string;
}

export class RequestAccessDTO {
  email: string;
  status: string;
  isAdmin: boolean;
}
