import { MulterModuleOptions } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { diskStorage } from 'multer';
import { existsSync, mkdirSync } from 'fs-extra';
import { HttpException, HttpStatus } from '@nestjs/common';
import { extname } from 'path';
import * as path from 'path';
import * as fs from 'fs';

const config = new ConfigService();

export const multerConfig = {
    dest: config.get('MULTER_DEST'),
};

export const multerOptions: MulterModuleOptions = {
    limits: {
        fileSize: config.getOrThrow('MULTER_FILE_SIZE'),
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.match(/\/(csv|json)$/)) {
            cb(null, true);
        } else {
            cb(new HttpException(`Unsupported file type ${extname(file.originalname)}`, HttpStatus.BAD_REQUEST), false);
        }
    },
    storage: diskStorage({
        destination: (req, file, cb) => {
            const uploadPath = path.join(__dirname, '../../../src', multerConfig.dest);
            cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
            const filename = `${Date.now()}-${file.originalname}`;
            cb(null, filename);
        },
    }),
};
