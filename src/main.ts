import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './modules/app/app.module';

const bootstrap = async () => {
    try {
        const app = await NestFactory.create<NestExpressApplication>(AppModule);
        const PORT = process.env.PORT || 5000;

        app.useGlobalPipes(new ValidationPipe());
        app.enableCors();

        await app.init();
        await app.listen(PORT, () => console.log(`Server started on PORT ${PORT}`));
    } catch (error) {
        console.log(error);
    }
};

bootstrap();
