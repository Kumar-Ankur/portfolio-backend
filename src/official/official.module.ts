import { Module } from '@nestjs/common';
import { OfficialService } from './official.service';
import { OfficialController } from './official.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { OfficialSchema } from './official.model';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Official', schema: OfficialSchema }]),
  ],
  providers: [OfficialService],
  controllers: [OfficialController],
})
export class OfficialModule {}
