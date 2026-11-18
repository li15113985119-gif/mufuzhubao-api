import { BadRequestException, Controller, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { extname, join } from 'node:path';
import { randomUUID } from 'node:crypto';
import { UserGuard } from '../common/auth.guard';
const allowedExtensions = new Set(['.png', '.jpg', '.jpeg', '.webp']);
const allowedMime = new Set(['image/png', 'image/jpeg', 'image/webp']);
@ApiTags('用户上传') @ApiBearerAuth() @UseGuards(UserGuard) @Controller('uploads')
export class UserUploadController {
  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiBody({ schema: { type: 'object', properties: { file: { type: 'string', format: 'binary' } } } })
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({ destination: join(process.cwd(), process.env.UPLOAD_DIR || 'uploads'), filename: (_req, file, callback) => callback(null, `${randomUUID()}${extname(file.originalname).toLowerCase()}`) }),
    limits: { fileSize: 10 * 1024 * 1024, files: 1 },
    fileFilter: (_req, file, callback) => { const ext = extname(file.originalname).toLowerCase(); if (!allowedExtensions.has(ext) || !allowedMime.has(file.mimetype)) callback(new BadRequestException('仅支持 png/jpg/webp 图片'), false); else callback(null, true); },
  }))
  upload(@UploadedFile() file?: Express.Multer.File) {
    if (!file) throw new BadRequestException('请选择图片');
    const baseUrl = (process.env.PUBLIC_BASE_URL || `http://localhost:${process.env.PORT || 3000}`).replace(/\/$/, '');
    return { fileName: file.originalname, fileUrl: `${baseUrl}/uploads/${file.filename}`, mimeType: file.mimetype, fileSize: file.size };
  }
}