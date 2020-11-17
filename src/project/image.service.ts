import { Injectable } from '@nestjs/common';
import {
  MulterModuleOptions,
  MulterOptionsFactory,
} from '@nestjs/platform-express';
import * as GridfsStorage from 'multer-gridfs-storage';

@Injectable()
export class ImageService implements MulterOptionsFactory {
  gridFsStorage: GridfsStorage;
  constructor() {
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
}
