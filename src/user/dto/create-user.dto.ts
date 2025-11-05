import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsDateString,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty({ message: 'O nome não pode estar vazio' })
  name: string;

  @IsEmail({}, { message: 'Por favor, insira um e-mail válido' })
  @IsNotEmpty({ message: 'O e-mail não pode estar vazio' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres' })
  @IsNotEmpty({ message: 'A senha não pode estar vazia' })
  password: string;

  @IsString()
  @IsNotEmpty({ message: 'O CPF não pode estar vazio' })
  cpf: string;

  @IsString()
  @IsNotEmpty({ message: 'O CNS não pode estar vazio' })
  cns: string;

  @IsDateString(
    {},
    { message: 'A data de nascimento deve estar no formato ISO (YYYY-MM-DD)' },
  )
  @IsNotEmpty({ message: 'A data de nascimento não pode estar vazia' })
  birthDate: Date;

  @IsString()
  @IsNotEmpty({ message: 'O telefone não pode estar vazio' })
  phone: string;
}
