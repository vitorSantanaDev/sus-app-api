import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import {
  ExamAvailability,
  ExamAvailabilitySchema,
} from 'src/exam/schemas/exam-availability.schema';

export type HealthUnitDocument = HealthUnit & Document;

@Schema({ timestamps: true })
export class HealthUnit {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  address: string;

  @Prop({ type: [ExamAvailabilitySchema], default: [] })
  availableExams: ExamAvailability[];
}

export const HealthUnitSchema = SchemaFactory.createForClass(HealthUnit);
