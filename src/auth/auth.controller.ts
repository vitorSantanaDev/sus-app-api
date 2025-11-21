import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { RequestResetDto } from './dto/request-reset.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ValidateCodeDto } from './dto/validate-code.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('recover')
  @HttpCode(HttpStatus.OK)
  async requestReset(@Body() requestResetDto: RequestResetDto) {
    const response = await this.authService.requestPasswordReset(
      requestResetDto.email,
    );

    return {
      message:
        'Se o e-mail estiver registrado, um código foi enviado para o console.',
      code: response?.code,
      expires: response?.expires,
    };
  }

  @Post('validate-code')
  @HttpCode(HttpStatus.OK)
  async validateCode(@Body() validateCodeDto: ValidateCodeDto) {
    await this.authService.validateResetCode(
      validateCodeDto.email,
      validateCodeDto.code,
    );
    return {
      message:
        'Código validado com sucesso. Prossiga para a redefinição de senha.',
    };
  }

  @Post('reset')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    await this.authService.resetPassword(
      resetPasswordDto.email,
      resetPasswordDto.code,
      resetPasswordDto.newPassword,
    );
    return { message: 'Senha atualizada com sucesso.' };
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    );

    if (!user) {
      throw new UnauthorizedException('E-mail ou senha inválidos');
    }

    return this.authService.login(user);
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }
}
