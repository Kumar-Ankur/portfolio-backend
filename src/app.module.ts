import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { EducationModule } from './education/education.module';
import { OfficialModule } from './official/official.module';
import { LoginModule } from './login/login.module';
import { ProjectModule } from './project/project.module';
import { ContactModule } from './contact/contact.module';
import { AuthModule } from './auth/auth.module';
@Module({
  imports: [
    UsersModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get('MAIL_HOST'),
          port: configService.get('MAIL_PORT'),
          secure: true,
          auth: {
            user: configService.get('REQUEST_ACCESS_EMAIL'),
            pass: configService.get('REQUEST_ACCESS_PASSWORD'),
          },
        },
        template: {
          dir: process.cwd() + '/template/',
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI, { useNewUrlParser: true }),
    EducationModule,
    OfficialModule,
    AuthModule,
    LoginModule,
    ProjectModule,
    ContactModule,
  ],
  providers: [],
})
export class AppModule {}
