import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Doctor, DoctorDocument } from './schemas/doctor.schema';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';

@Injectable()
export class DoctorService {
  constructor(
    @InjectModel(Doctor.name) private doctorModel: Model<DoctorDocument>,
  ) {}

  async create(createDoctorDto: CreateDoctorDto): Promise<Doctor> {
    const existingDoctor = await this.doctorModel.findOne({
      crm: createDoctorDto.crm,
    });
    if (existingDoctor) {
      throw new ConflictException('Um médico com este CRM já existe');
    }
    const createdDoctor = new this.doctorModel(createDoctorDto);
    return createdDoctor.save();
  }

  async findAll(specialty?: string): Promise<Doctor[]> {
    const filter = specialty ? { specialty } : {};
    return this.doctorModel.find(filter).exec();
  }

  async findOne(id: string): Promise<Doctor> {
    const doctor = await this.doctorModel.findById(id).exec();
    if (!doctor) {
      throw new NotFoundException(`Médico com ID "${id}" não encontrado`);
    }
    return doctor;
  }

  async update(id: string, updateDoctorDto: UpdateDoctorDto): Promise<Doctor> {
    const existingDoctor = await this.doctorModel
      .findByIdAndUpdate(id, updateDoctorDto, { new: true })
      .exec();

    if (!existingDoctor) {
      throw new NotFoundException(`Médico com ID "${id}" não encontrado`);
    }
    return existingDoctor;
  }

  async remove(id: string): Promise<any> {
    const result = await this.doctorModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Médico com ID "${id}" não encontrado`);
    }
    return { message: 'Médico removido com sucesso' };
  }
}
