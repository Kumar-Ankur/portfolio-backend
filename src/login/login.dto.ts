import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString } from 'class-validator';

export class RegisterDTO {
  @IsString()
  @ApiProperty()
  firstName: string;

  @IsString()
  @ApiProperty()
  lastName: string;

  @IsString()
  @ApiProperty()
  email: string;

  @IsString()
  @ApiProperty()
  password: string;

  @IsString()
  @ApiProperty()
  profileImageId: string;
}

export class LoginDTO {
  @IsString()
  @ApiProperty()
  email: string;

  @IsString()
  @ApiProperty()
  password: string;
}

export class VerifyEmailDTO {
  @IsString()
  @ApiProperty()
  email: string;
}

export class UpdateImageDTO {
  @IsString()
  @ApiProperty()
  profileImageId: string;
}

export class RequestAccessDTO {
  @IsString()
  @ApiProperty()
  email: string;

  @IsString()
  @ApiProperty()
  status: string;

  @IsBoolean()
  @ApiProperty()
  isAdmin: boolean;
}
