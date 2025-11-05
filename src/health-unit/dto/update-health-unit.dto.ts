import { PartialType } from '@nestjs/mapped-types';
import { CreateHealthUnitDto } from './create-health-unit.dto';

export class UpdateHealthUnitDto extends PartialType(CreateHealthUnitDto) {}
