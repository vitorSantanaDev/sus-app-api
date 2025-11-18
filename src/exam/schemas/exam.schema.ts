import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../../user/schemas/user.schema';
import { HealthUnit } from '../../health-unit/schemas/health-unit.schema';

export type ExamDocument = Exam & Document;

@Schema({ timestamps: true })
export class Exam {
  @Prop({ required: true, index: true })
  examId: string;

  @Prop({ required: true, default: 'Pending', index: true })
  status: string;

  @Prop({ required: true, type: Date })
  dateTime: Date;

  @Prop({
    type: Types.ObjectId,
    ref: User.name,
    required: true,
    index: true,
  })
  user: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: HealthUnit.name,
    required: true,
    index: true,
  })
  healthUnit: Types.ObjectId;
}

export const ExamSchema = SchemaFactory.createForClass(Exam);
