import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiResponse,
  ApiResponseOptions,
} from '@nestjs/swagger';

export function SwaggerResponse(
  statusCode: HttpStatus,
  message: string,
  description?: string,
  data?: any,
  options?: ApiResponseOptions,
) {
  return applyDecorators(
    ApiResponse({
      ...options,
      status: statusCode,
      description: description,
      schema: {
        default: {
          statusCode: statusCode,
          message: message,
          data:data
        }
      },
    }),
  );
}
