import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { EducationModule } from './education/education.module';
import { OfficialModule } from './official/official.module';
import { AuthModule } from './auth/auth.module';
import { ProjectModule } from './project/project.module';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    UsersModule,
    MongooseModule.forRoot(
      'mongodb+srv://root:root@cluster0.vf3fg.mongodb.net/portfolio?retryWrites=true&w=majority',
    ),
    EducationModule,
    OfficialModule,
    AuthModule,
    ProjectModule,
  ],
  providers: [],
})
export class AppModule {}
