import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { StopsModule } from './stops/stops.module';
import { CarsModule } from './cars/cars.module';
import { TicketsModule } from './tickets/tickets.module';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const dbConnectionMode = configService.get('DATABASE_CONNECTION_MODE');
        let dbUri = '';
        if (dbConnectionMode === 'local') {
          dbUri = `mongodb://${process.env.DATABASE_USER}:${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_HOST}:${process.env.DATABASE_PORT}/uber?retryWrites=true&w=majority`;
        } else {
          dbUri = `mongodb+srv://${process.env.DATABASE_USER}:${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_HOST}/uber?retryWrites=true&w=majority`;
        }
        console.log(dbUri);
        return {
          uri: dbUri,
        };
      },
    }),
    StopsModule,
    CarsModule,
    TicketsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
