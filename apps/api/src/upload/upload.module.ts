import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { UserUploadController } from './user-upload.controller';
@Module({ controllers: [UploadController, UserUploadController] })
export class UploadModule {}