import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DoctorService } from './doctor.service';
import { DoctorController } from './doctor.controller';
import { Doctor, DoctorSchema } from './schemas/doctor.schema';
import { HealthUnitModule } from 'src/health-unit/health-unit.module';
import {
  Appointment,
  AppointmentSchema,
} from 'src/appointment/schemas/appointment.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Doctor.name, schema: DoctorSchema }]),
    MongooseModule.forFeature([
      { name: Appointment.name, schema: AppointmentSchema },
    ]),
    HealthUnitModule,
  ],
  controllers: [DoctorController],
  providers: [DoctorService],
  exports: [DoctorService],
})
export class DoctorModule {}
