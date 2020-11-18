import { Module } from '@nestjs/common';
import { ContactService } from './contact.service';
import { ContactController } from './contact.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ContactSchema } from './contact.model';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'contact', schema: ContactSchema }]),
  ],
  providers: [ContactService],
  controllers: [ContactController],
})
export class ContactModule {}
