import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HealthUnitService } from './health-unit.service';
import { HealthUnitController } from './health-unit.controller';
import { HealthUnit, HealthUnitSchema } from './schemas/health-unit.schema';
import { Exam, ExamSchema } from 'src/exam/schemas/exam.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: HealthUnit.name, schema: HealthUnitSchema },
    ]),
    MongooseModule.forFeature([{ name: Exam.name, schema: ExamSchema }]),
  ],
  controllers: [HealthUnitController],
  providers: [HealthUnitService],
  exports: [HealthUnitService],
})
export class HealthUnitModule {}
