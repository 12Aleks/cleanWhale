import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { UserModule } from './user/user.module';
import configuration from "./config/configuration";
import {validationSchema} from "./config/validation";
import {MongooseModule} from "@nestjs/mongoose";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [configuration],
            validationSchema,
        }),

        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                const username = configService.get<string>('mongo.username');
                const password = configService.get<string>('mongo.password');
                const dbname = configService.get<string>('mongo.db');

                if (!username || !password || !dbname) {
                    throw new Error('MongoDB configuration is missing!');
                }

                const uri = `mongodb+srv://${encodeURIComponent(username)}:${encodeURIComponent(password)}@cluster0.njbnlr9.mongodb.net/${encodeURIComponent(dbname)}?retryWrites=true&w=majority`;

                return { uri };
            },
        }),

        UserModule,
        AuthModule,
    ],
})
export class AppModule {}
