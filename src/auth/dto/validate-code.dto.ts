import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ValidateCodeDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  code: string;
}
