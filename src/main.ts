import { AppModule } from './modules/app/app.module';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

const start = async () => {
    try {
        const app = await NestFactory.create(AppModule);
        const PORT = process.env.PORT || 5000;
        await app.init();

        app.useGlobalPipes(new ValidationPipe());
        app.enableCors();

        await app.listen(PORT, () => console.log(`Server started on PORT ${PORT}`));
    } catch (error) {
        console.log(error);
    }
};

start();
