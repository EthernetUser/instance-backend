import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './modules/app/app.module';

const bootstrap = async () => {
    try {
        const app = await NestFactory.create<NestExpressApplication>(AppModule);
        const PORT = process.env.PORT || 5000;
        await app.init();

        app.useGlobalPipes(new ValidationPipe());
        app.enableCors({
            origin: ['http://localhost:3000'],
            methods: ['GET', 'POST', 'PUT', 'DELETE'],
        });
        
        //7 hello world 

        await app.listen(PORT, () => console.log(`Server started on PORT ${PORT}`));
    } catch (error) {
        console.log(error);
    }
};

bootstrap();
