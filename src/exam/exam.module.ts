import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Exam, ExamSchema } from './schemas/exam.schema';
import { HealthUnitModule } from '../health-unit/health-unit.module';

import {
  Appointment,
  AppointmentSchema,
} from '../appointment/schemas/appointment.schema';
import { ExamController } from './exam.controller';
import { ExamService } from './exam.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Exam.name, schema: ExamSchema }]),

    HealthUnitModule,

    MongooseModule.forFeature([
      { name: Appointment.name, schema: AppointmentSchema },
    ]),
  ],
  controllers: [ExamController],
  providers: [ExamService],
  exports: [ExamService],
})
export class ExamModule {}
