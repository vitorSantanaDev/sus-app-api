import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import {
  DateAvailability,
  DateAvailabilitySchema,
} from 'src/common/schemas/date-availability.schema';
import { HealthUnit } from 'src/health-unit/schemas/health-unit.schema';

export type DoctorDocument = Doctor & Document;

@Schema({ timestamps: true })
export class Doctor {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  crm: string;

  @Prop({ required: true, index: true })
  specialty: string;

  @Prop({
    type: Types.ObjectId,
    ref: HealthUnit.name,
    required: true,
  })
  healthUnit: Types.ObjectId;

  @Prop({ type: [DateAvailabilitySchema], default: [] })
  availability: DateAvailability[];
}

export const DoctorSchema = SchemaFactory.createForClass(Doctor);
