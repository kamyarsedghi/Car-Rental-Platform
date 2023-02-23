import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { SwaggerModule, DocumentBuilder, SwaggerDocumentOptions } from '@nestjs/swagger';
import { DateQueryDto } from './car/dto/dateQuery.dto';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.use(helmet());

    const config = new DocumentBuilder()
        .setTitle('Car Rental Platform API')
        .setDescription('The endoints for the Car Rental Platform API')
        .setVersion('1.0')
        .addTag('Car Rental Platform API Tag')
        .build();

    const options: SwaggerDocumentOptions = {
        extraModels: [DateQueryDto],
    };

    const document = SwaggerModule.createDocument(app, config, options);
    SwaggerModule.setup('api', app, document);

    await app.listen(3000);
}
bootstrap();
