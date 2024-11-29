import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { VerificationTokenModule } from './verification-token/verification-token.module';
import { ConversationModule } from './converstion/conversation.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailerAsyncOptions } from '@nestjs-modules/mailer/dist/interfaces/mailer-async-options.interface';
import {MessageModule} from "./message/message.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRootAsync(<TypeOrmModuleAsyncOptions>{
      inject: [ConfigService],

      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST'),
        port: parseInt(config.get('DB_PORT')),
        username: config.get('DB_USERNAME'),
        password: config.get('DB_PASSWORD'),
        database: config.get('DB_NAME'),
        //synchronize Should be false in production
        synchronize: true,
        autoLoadEntities: true,
      }),
    }),

    MailerModule.forRootAsync(<MailerAsyncOptions>{
      inject: [ConfigService],

      useFactory: (config: ConfigService) => ({
        transport: {
          service: config.get('SMTP_SERVICE'),
          auth: {
            user: config.get('SMTP_USERNAME'),
            pass: config.get('SMTP_PASSWORD'),
          },
        },
      }),
    }),

    UsersModule,
    AuthModule,
    VerificationTokenModule,
    ConversationModule,
    MessageModule,
  ],
})
export class AppModule {}
