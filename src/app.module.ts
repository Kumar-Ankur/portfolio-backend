import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { EducationModule } from './education/education.module';
import { OfficialModule } from './official/official.module';
import { AuthModule } from './login/login.module';
import { ProjectModule } from './project/project.module';
import { ContactModule } from './contact/contact.module';

@Module({
  imports: [
    UsersModule,
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGODB_URI, { useNewUrlParser: true }),
    EducationModule,
    OfficialModule,
    AuthModule,
    ProjectModule,
    ContactModule,
  ],
  providers: [],
})
export class AppModule {}
