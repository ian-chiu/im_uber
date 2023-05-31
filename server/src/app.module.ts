import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from 'src/app.controller';
import { AppService } from 'src/app.service';
import { StopsController } from 'src/stops/stops.controller';
import { StopsService } from 'src/stops/stops.service';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    MongooseModule.forRoot(
      //database url string
      'mongodb://localhost:27017/uber',
    ),
  ],
  controllers: [AppController, StopsController],
  providers: [AppService, StopsService],
})
export class AppModule {}
