import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HealthUnit, HealthUnitDocument } from './schemas/health-unit.schema';
import { CreateHealthUnitDto } from './dto/create-health-unit.dto';
import { UpdateHealthUnitDto } from './dto/update-health-unit.dto';

@Injectable()
export class HealthUnitService {
  constructor(
    @InjectModel(HealthUnit.name)
    private healthUnitModel: Model<HealthUnitDocument>,
  ) {}

  async create(createHealthUnitDto: CreateHealthUnitDto): Promise<HealthUnit> {
    const existingUnit = await this.healthUnitModel.findOne({
      name: createHealthUnitDto.name,
    });
    if (existingUnit) {
      throw new ConflictException(
        'Uma unidade de saúde com este nome já existe',
      );
    }

    const createdHealthUnit = new this.healthUnitModel(createHealthUnitDto);
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
