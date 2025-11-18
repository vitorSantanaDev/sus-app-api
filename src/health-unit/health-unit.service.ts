/* eslint-disable @typescript-eslint/no-base-to-string */
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HealthUnit, HealthUnitDocument } from './schemas/health-unit.schema';
import { CreateHealthUnitDto } from './dto/create-health-unit.dto';
import { UpdateHealthUnitDto } from './dto/update-health-unit.dto';
import { EXAM_TYPES_MAP } from 'src/common/constants/exam-types.constant';
import { Exam, ExamDocument } from 'src/exam/schemas/exam.schema';

@Injectable()
export class HealthUnitService {
  constructor(
    @InjectModel(HealthUnit.name)
    private healthUnitModel: Model<HealthUnitDocument>,
    @InjectModel(Exam.name) private examModel: Model<ExamDocument>,
  ) {}

  async getAvailableExams(unitId: string): Promise<any[]> {
    const unit = await this.healthUnitModel.findById(unitId).lean().exec();
    if (!unit) {
      throw new NotFoundException('Unidade não encontrada');
    }

    const bookedExams = await this.examModel
      .find({
        healthUnit: unitId,
        status: { $ne: 'Cancelled' },
      })
      .select('examId dateTime')
      .lean()
      .exec();

    const bookedSlots = new Set<string>();

    bookedExams.forEach((exam) => {
      const key = `${exam.examId}_${exam.dateTime.toISOString()}`;
      bookedSlots.add(key);
    });

    const availableExamsList = unit.availableExams.map((examSchedule) => {
      const filteredAvailability = examSchedule.availability.flatMap(
        (daySchedule) => {
          const availableTimes = daySchedule.times.filter((time) => {
            const dateTimeObject = new Date(
              `${daySchedule.date}T${time}:00.000Z`,
            );
            const key = `${examSchedule.examId}_${dateTimeObject.toISOString()}`;
            return !bookedSlots.has(key);
          });

          if (availableTimes.length > 0) {
            return [{ ...daySchedule, times: availableTimes }];
          }
          return [];
        },
      );

      return { ...examSchedule, availability: filteredAvailability };
    });

    return availableExamsList.filter((exam) => exam.availability.length > 0);
  }

  async create(createHealthUnitDto: CreateHealthUnitDto): Promise<HealthUnit> {
    const populatedExams = createHealthUnitDto.availableExams.map((exam) => {
      const examName = EXAM_TYPES_MAP.get(exam.examId);
      if (!examName) {
        throw new BadRequestException(`ID de exame inválido: ${exam.examId}`);
      }
      return { ...exam, examName };
    });

    const createdHealthUnit = new this.healthUnitModel({
      ...createHealthUnitDto,
      availableExams: populatedExams,
    });
    return createdHealthUnit.save();
  }

  async findAll(): Promise<HealthUnit[]> {
    return this.healthUnitModel.find().exec();
  }

  async findOne(id: string): Promise<HealthUnit> {
    const unit = await this.healthUnitModel.findById(id).exec();
    if (!unit) {
      throw new NotFoundException(`Unidade com ID "${id}" não encontrada`);
    }
    return unit;
  }

  async findWithExams(): Promise<HealthUnit[]> {
    const units = await this.healthUnitModel.find().lean().exec();

    const now = new Date();

    const futureBookings = await this.examModel
      .find({
        dateTime: { $gte: now },
        status: { $ne: 'Cancelled' },
      })
      .select('healthUnit examId dateTime')
      .lean()
      .exec();

    const bookedSet = new Set<string>();
    futureBookings.forEach((booking: any) => {
      const key = `${String(booking.healthUnit)}_${booking.examId}_${booking.dateTime.toISOString()}`;
      bookedSet.add(key);
    });

    const availableUnits = units.filter((unit) => {
      return unit.availableExams.some((exam) => {
        return exam.availability.some((daySchedule) => {
          return daySchedule.times.some((time) => {
            const dateTimeObject = new Date(
              `${daySchedule.date}T${time}:00.000Z`,
            );

            if (dateTimeObject <= now) return false;

            const key = `${String(unit._id)}_${exam.examId}_${dateTimeObject.toISOString()}`;
            const isBooked = bookedSet.has(key);

            return !isBooked;
          });
        });
      });
    });

    return availableUnits;
  }

  async update(
    id: string,
    updateHealthUnitDto: UpdateHealthUnitDto,
  ): Promise<HealthUnit> {
    const existingUnit = await this.healthUnitModel
      .findByIdAndUpdate(id, updateHealthUnitDto, { new: true })
      .exec();

    if (!existingUnit) {
      throw new NotFoundException(`Unidade com ID "${id}" não encontrada`);
    }
    return existingUnit;
  }

  async remove(id: string): Promise<any> {
    const result = await this.healthUnitModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Unidade com ID "${id}" não encontrada`);
    }
    return { message: 'Unidade de saúde removida com sucesso' };
  }
}
