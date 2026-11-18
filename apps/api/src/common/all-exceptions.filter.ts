import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();
    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    let message = '服务器内部错误';
    if (exception instanceof HttpException) {
      const payload = exception.getResponse();
      if (typeof payload === 'string') message = payload;
      else if (typeof payload === 'object' && payload !== null && 'message' in payload) {
        const raw = (payload as { message: unknown }).message;
        message = Array.isArray(raw) ? raw.join('；') : String(raw);
      }
    } else if (exception instanceof Error) {
      message = process.env.NODE_ENV === 'production' ? message : exception.message;
    }
    response.status(status).json({ code: status * 100 + 1, message, data: null });
  }
}