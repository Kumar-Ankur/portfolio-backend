import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EducationService } from './education.service';
import { EducationController } from './education.controller';
import { EducationSchema } from './education.model';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Education', schema: EducationSchema }]),
  ],
  providers: [EducationService],
  controllers: [EducationController],
})
export class EducationModule {}
