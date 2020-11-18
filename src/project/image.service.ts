import {
  Injectable,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { MongoGridFS } from 'mongo-gridfs';
import { Connection, Mongoose } from 'mongoose';
import {
  MulterModuleOptions,
  MulterOptionsFactory,
} from '@nestjs/platform-express';
import * as GridfsStorage from 'multer-gridfs-storage';
import * as mongoose from 'mongoose';

@Injectable()
export class ImageService implements MulterOptionsFactory {
  gridFsStorage: GridfsStorage;
  private fileModel: MongoGridFS;
  constructor(@InjectConnection() private readonly connection: Connection) {
    this.fileModel = new MongoGridFS(this.connection.db, 'fs');
    this.gridFsStorage = new GridfsStorage({
      url: process.env.MONGODB_URI,
      file: (req, file) => {
        return new Promise((resolve, reject) => {
          const fileName = file.originalname.trim();
          const fileInfo = {
            fileName,
          };
          resolve(fileInfo);
        });
      },
    });
  }

  createMulterOptions(): MulterModuleOptions {
    return {
      storage: this.gridFsStorage,
    };
  }

  async readStream(id: string) {
    return await this.fileModel.readFileStream(id);
  }

  async getImageData() {
    return await this.fileModel.find({});
  }

  async findInfo(id: string) {
    const result = await this.fileModel
      .findById(id)
      .catch((err) => {
        throw new HttpException('File not found', HttpStatus.NOT_FOUND);
      })
      .then((result) => result);
    return {
      filename: result.filename,
      length: result.length,
      chunkSize: result.chunkSize,
      md5: result.md5,
      contentType: result.contentType,
      id: result._id,
    };
  }

  async deleteFile(id: string): Promise<boolean> {
    return await this.fileModel.delete(id);
  }
}
