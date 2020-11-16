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
      url:
        'mongodb+srv://root:root@cluster0.vf3fg.mongodb.net/portfolio?retryWrites=true&w=majority',
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
