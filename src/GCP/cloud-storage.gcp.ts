import { Storage } from '@google-cloud/storage';
import { ApiResponse } from '@utils/api-response';
import { NextFunction, Request, Response } from 'express';
import multer, { MulterError } from 'multer';
import { inject, injectable } from 'tsyringe';

@injectable()
export class CloudStorage {
  constructor(
    @inject('ApiResponse')
    private apiResponse: ApiResponse,
  ) {}

  storage = new Storage();
  bucket = this.storage.bucket(process.env.GCS_BUCKET!);

  upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 },
  });

  multerSingle = (field: string) => (request: Request, response: Response, next: NextFunction) =>
    this.upload.single(field)(request, response, (err: unknown) => {
      if (err instanceof MulterError && err.code === 'LIMIT_FILE_SIZE') {
        return this.apiResponse.Error(response, 400, 'File too large (max 10 MB).');
      } else if (err) {
        return this.apiResponse.Error(response, 500, 'Middleware error to get the file');
      }
      next();
    });

  async saveFile(
    request: Request,
    response: Response,
    key: string,
    extras?: { title?: string; projectId?: string },
  ): Promise<string> {
    if (!process.env.GCS_BUCKET)
      this.apiResponse.Error(response, 400, 'Environment variable GCS_BUCKET is not set');
    if (!request.file) this.apiResponse.Error(response, 400, 'No file provided');

    const gcsFile = this.bucket.file(key);

    await gcsFile.save(request.file.buffer, {
      contentType: request.file.mimetype,
      metadata: {
        metadata: {
          title: extras?.title || '',
          projectid: extras?.projectId || '',
        },
      },
    });

    return key;
  }

  async deleteFile(key: string): Promise<void> {
    await this.bucket.file(key).delete();
  }

  async getReadSignedUrl(key: string, ttlMs = 300 * 60 * 1000): Promise<[string]> {
    return await this.bucket.file(key).getSignedUrl({
      version: 'v4',
      action: 'read',
      expires: Date.now() + ttlMs,
    });
  }

  async getWriteSignedUrl(
    key: string,
    contentType: string,
    ttlMs = 300 * 60 * 1000,
  ): Promise<[string]> {
    return await this.bucket.file(key).getSignedUrl({
      version: 'v4',
      action: 'write',
      expires: Date.now() + ttlMs,
      contentType,
    });
  }
}
