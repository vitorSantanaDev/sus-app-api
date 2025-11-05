import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { DoctorModule } from './doctor/doctor.module';
import { HealthUnitModule } from './health-unit/health-unit.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('DB_URL_CONNECTION'),
      }),
      inject: [ConfigService],
    }),
    UserModule,
    AuthModule,
    DoctorModule,
    HealthUnitModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
