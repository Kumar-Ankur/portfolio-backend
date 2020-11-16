import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ProjectSchema } from './project.model';
import { MulterModule } from '@nestjs/platform-express';
import { ImageService } from './image.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'project', schema: ProjectSchema }]),
    MulterModule.registerAsync({
      useClass: ImageService,
    }),
  ],
  providers: [ImageService, ProjectService],
  controllers: [ProjectController],
})
export class ProjectModule {}
