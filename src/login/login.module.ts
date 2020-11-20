import { Module } from '@nestjs/common';
import { LoginService } from './login.service';
import { AuthController } from './login.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { LoginSchema } from './login.model';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Login', schema: LoginSchema }]),
  ],
  providers: [LoginService],
  controllers: [AuthController],
})
export class AuthModule {}
