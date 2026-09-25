import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class CloudinaryService {
    private readonly isConfigured: boolean;

    constructor(configService: ConfigService) {
        const cloudName = configService.get<string>('CLOUDINARY_CLOUD_NAME');
        const apiKey = configService.get<string>('CLOUDINARY_API_KEY');
        const apiSecret = configService.get<string>('CLOUDINARY_API_SECRET');

        if (!cloudName || !apiKey || !apiSecret) {
            this.isConfigured = false;
            return;
        }

        cloudinary.config({
            cloud_name: cloudName,
            api_key: apiKey,
            api_secret: apiSecret,
        });

        this.isConfigured = true;
    }

    uploadImage(file: Express.Multer.File, folder: string): Promise<string> {
        if (!this.isConfigured) {
            return Promise.reject(
                new Error(
                    'As variáveis CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY e CLOUDINARY_API_SECRET são obrigatórias para upload',
                ),
            );
        }

        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder,
                    resource_type: 'image',
                },
                (error, result) => {
                    if (error) {
                        reject(error);
                        return;
                    }

                    if (!result?.secure_url) {
                        reject(new Error('O Cloudinary não retornou a URL da imagem'));
                        return;
                    }

                    resolve(result.secure_url);
                },
            );

            uploadStream.end(file.buffer);
        });
    }
}