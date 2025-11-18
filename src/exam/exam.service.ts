import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Exam, ExamDocument } from './schemas/exam.schema';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';
import { HealthUnitService } from '../health-unit/health-unit.service';
import {
  Appointment,
  AppointmentDocument,
} from '../appointment/schemas/appointment.schema';

@Injectable()
export class ExamService {
  constructor(
    private healthUnitService: HealthUnitService,
    @InjectModel(Appointment.name)
    private appointmentModel: Model<AppointmentDocument>,
    @InjectModel(Exam.name) private examModel: Model<ExamDocument>,
  ) {}

  async create(createExamDto: CreateExamDto, userId: string): Promise<Exam> {
    const { healthUnitId, examId, availabilityId, time } = createExamDto;

    const healthUnit = await this.healthUnitService.findOne(healthUnitId);

    const examSchedule = healthUnit.availableExams.find(
      (e: any) => e.examId === examId,
    );
    if (!examSchedule) {
      throw new BadRequestException(
        'Esta unidade não oferece o exame selecionado',
      );
    }

    const daySchedule = examSchedule.availability.find(
      (a: any) => a.id === availabilityId,
    );
    if (!daySchedule) {
      throw new NotFoundException('Agenda não encontrada para este exame');
    }

    if (!daySchedule.times.includes(time)) {
      throw new ConflictException('Horário não disponível');
    }

    const dateTimeObject = new Date(`${daySchedule.date}T${time}:00.000Z`);
    if (dateTimeObject < new Date()) {
      throw new ConflictException('Não é possível agendar em datas passadas');
    }

    const existingAppointment = await this.appointmentModel.findOne({
      user: userId,
      dateTime: dateTimeObject,
      status: { $ne: 'Cancelled' },
    });

    if (existingAppointment) {
      throw new ConflictException(
        'Conflito: Você já tem uma CONSULTA neste horário',
      );
    }

    const existingExam = await this.examModel.findOne({
      user: userId,
      dateTime: dateTimeObject,
      status: { $ne: 'Cancelled' },
    });

    if (existingExam) {
      throw new ConflictException(
        'Conflito: Você já tem outro EXAME neste horário',
      );
    }

    const newExam = new this.examModel({
      examId: examId,
      dateTime: dateTimeObject,
      healthUnit: healthUnitId,
      user: userId,
      status: 'Pending',
    });

    return (await newExam.save()).populate('healthUnit', 'name address');
  }

  async findAllForUser(userId: string): Promise<Exam[]> {
    return this.examModel
      .find({ user: userId })
      .populate('healthUnit', 'name address')
      .sort({ dateTime: 1 })
      .exec();
  }

  async findOneForUser(id: string, userId: string): Promise<Exam> {
    const exam = await this.examModel
      .findOne({ _id: id, user: userId })
      .populate('healthUnit', 'name address')
      .exec();

    if (!exam) {
      throw new NotFoundException(
        'Exame não encontrado ou não pertence a este usuário',
      );
    }
    return exam;
  }

  async updateForUser(
    id: string,
    updateExamDto: UpdateExamDto,
    userId: string,
  ): Promise<Exam> {
    const updatedExam = await this.examModel
      .findOneAndUpdate({ _id: id, user: userId }, updateExamDto, { new: true })
      .exec();

    if (!updatedExam) {
      throw new NotFoundException(
        'Exame não encontrado ou não pertence a este usuário',
      );
    }
    return updatedExam;
  }

  async removeForUser(id: string, userId: string): Promise<void> {
    const result = await this.examModel
      .findOneAndDelete({ _id: id, user: userId })
      .exec();

    if (!result) {
      throw new NotFoundException(
        'Exame não encontrado ou não pertence a este usuário',
      );
    }
  }
}
