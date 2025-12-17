import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ObjectStorageProvider {
  private client: S3Client;
  private bucket: string;

  constructor(private config: ConfigService) {
    this.bucket = this.config.getOrThrow<string>('OBJECT_STORAGE_BUCKET_NAME');

    this.client = new S3Client({
      region: 'kr-standard',
      endpoint: 'https://kr.object.ncloudstorage.com',
      credentials: {
        accessKeyId: this.config.getOrThrow<string>('NCP_ACCESS_KEY_ID'),
        secretAccessKey: this.config.getOrThrow<string>('NCP_SECRET_ACCESS_KEY'),
      },
    });
  }

  // TODO : 스토리지 파일 업로드되는 디렉토리는 어떻게 관리할지 고민
  // 일단 test 디렉토리로 고정
  async upload(file: Express.Multer.File): Promise<string> {
    const key = `test/${Date.now()}-${file.originalname}`;

    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );

    return key;
  }
}