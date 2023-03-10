import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { SwaggerModule, DocumentBuilder, SwaggerDocumentOptions } from '@nestjs/swagger';
import { DateQueryDto } from './car/dto/dateQuery.dto';
import { ConfigService } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';

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

    const microserviceRabbitMQ = app.connectMicroservice({
        transport: Transport.RMQ,
        options: {
            urls: ['amqp://user:password@rabbitmq:5672'],
            queue: 'the-main-queue',
            // false = manual acknowledgement; true = automatic acknowledgment
            noAck: false,
            // Get one by one
            prefetchCount: 1,
        },
    });
    await app.startAllMicroservices();

    await app.listen(configService.get('APP_PORT'));
}
bootstrap();
