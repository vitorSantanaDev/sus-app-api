import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../../user/schemas/user.schema';
import { Doctor } from '../../doctor/schemas/doctor.schema';
import { HealthUnit } from 'src/health-unit/schemas/health-unit.schema';

export type AppointmentDocument = Appointment & Document;

@Schema({ timestamps: true })
export class Appointment {
  @Prop({ required: true, type: Date })
  dateTime: Date;

  @Prop({ required: true })
  type: string;

  @Prop({ required: true, default: 'Pending', index: true })
  status: string;

  @Prop({
    type: Types.ObjectId,
    ref: User.name,
    required: true,
    index: true,
  })
  user: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: Doctor.name,
    required: true,
    index: true,
  })
  doctor: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: HealthUnit.name,
    required: true,
  })
  healthUnit: Types.ObjectId;
}

export const AppointmentSchema = SchemaFactory.createForClass(Appointment);
