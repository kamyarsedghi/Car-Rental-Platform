import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { SwaggerModule, DocumentBuilder, SwaggerDocumentOptions } from '@nestjs/swagger';
import { DateQueryDto } from './car/dto/dateQuery.dto';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
    const configService = new ConfigService();
    const app = await NestFactory.create(AppModule);
    app.use(helmet());

    const config = new DocumentBuilder()
        .setTitle(configService.get('APP_NAME'))
        .setDescription(configService.get('APP_DESCRIPTION'))
        .setVersion(configService.get('APP_VERSION'))
        // .addTag('Car Rental Platform API Tag')
        .build();

    const options: SwaggerDocumentOptions = {
        extraModels: [DateQueryDto],
    };

    const document = SwaggerModule.createDocument(app, config, options);
    SwaggerModule.setup('api', app, document);

    await app.listen(configService.get('APP_PORT'));
}
bootstrap();
