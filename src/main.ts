import { AppModule } from './modules/app/app.module';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';

const start = async () => {
    try {
        const app = await NestFactory.create<NestExpressApplication>(AppModule);
        const PORT = process.env.PORT || 5000;
        await app.init();

        app.useGlobalPipes(new ValidationPipe());
        // const whitelist = ['http://localhost:3000'];
        app.enableCors({
            origin: ['http://localhost:3000'],
            methods: ['GET', 'POST', 'PUT', 'DELETE'],
        });
        // app.enableCors();

        await app.listen(PORT, () => console.log(`Server started on PORT ${PORT}`));
    } catch (error) {
        console.log(error);
    }
};

start();
