import { IsNotEmpty, IsString } from 'class-validator';

export class CreateHealthUnitDto {
  @IsString()
  @IsNotEmpty({ message: 'O nome da unidade é obrigatório' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'O endereço é obrigatório' })
  address: string;
}
