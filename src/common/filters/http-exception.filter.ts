import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { Response } from 'express';
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const res = host.switchToHttp().getResponse<Response>();
    const status = exception instanceof HttpException ? exception.getStatus() : 500;
    const response: any = exception instanceof HttpException ? exception.getResponse() : { message: 'Internal server error' };
    res.status(status).json({ success: false, message: typeof response === 'string' ? response : response.message || 'Request failed', errorCode: `HTTP_${status}` });
  }
}
