import { Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { CommentModule } from './modules/comment/comment.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_PIPE } from '@nestjs/core';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './modules/auth/jwt.strategy';
import { PrismaService } from './common/prisma/prisma.service';
import { BookingModule } from './modules/booking/booking.module';
import { LocationModule } from './modules/location/location.module';
import { RoomsModule } from './modules/rooms/rooms.module';

@Module({
  imports: [
    AuthModule,
    CommentModule,
    UsersModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PassportModule.register({defaultStrategy:`jwt`}),
    JwtModule.register({
      secret: process.env.ACCESS_TOKEN_SECRET,
      signOptions:{expiresIn:`60`}
    }),
    BookingModule,
    RoomsModule,
    LocationModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
    JwtStrategy,
    ConfigService,
    PrismaService
  ],
})
export class AppModule {}
