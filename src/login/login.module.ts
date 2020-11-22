import { Module } from '@nestjs/common';
import { LoginService } from './login.service';
import { LoginController } from './login.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { LoginSchema, RequestAccessSchema } from './login.model';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Login', schema: LoginSchema },
      { name: 'RequestAccess', schema: RequestAccessSchema },
    ]),
    AuthModule,
  ],
  providers: [LoginService],
  controllers: [LoginController],
})
export class LoginModule {}
