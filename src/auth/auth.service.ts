import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { User, UserDocument } from 'src/user/schemas/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  private async _validateCode(
    email: string,
    code: string,
  ): Promise<UserDocument> {
    const user = await this.userModel
      .findOne({ email })
      .select('+resetPasswordCode +resetPasswordExpires')
      .exec();

    if (!user) {
      throw new BadRequestException('Código ou e-mail inválido.');
    }

    if (user.resetPasswordCode !== code) {
      throw new BadRequestException('Código de recuperação incorreto.');
    }

    if (!user.resetPasswordExpires || user.resetPasswordExpires < new Date()) {
      throw new BadRequestException('Código de recuperação expirado.');
    }

    return user;
  }

  async validateResetCode(email: string, code: string): Promise<void> {
    await this._validateCode(email, code);
  }

  async requestPasswordReset(email: string): Promise<{
    code: string;
    expires: Date;
  } | null> {
    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new BadRequestException(
        'Aconteceu algum erro durante sua solicitação, tente novamente mais tarde!',
      );
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();

    const tenMinutes = 10 * 60 * 1000;
    const expires = new Date(Date.now() + tenMinutes);

    await this.userModel
      .updateOne(
        { email },
        { resetPasswordCode: code, resetPasswordExpires: expires },
      )
      .exec();

    console.log(`\n======================================================`);
    console.log(`🔑 CÓDIGO DE RECUPERAÇÃO PARA: ${email}`);
    console.log(`   CÓDIGO (OTP): ${code}`);
    console.log(`   EXPIRA EM: ${expires.toLocaleString()}`);
    console.log(`======================================================\n`);

    return {
      code,
      expires,
    };
  }

  async resetPassword(
    email: string,
    code: string,
    newPassword: string,
  ): Promise<void> {
    await this._validateCode(email, code);

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await this.userModel
      .updateOne(
        { email },
        {
          password: hashedPassword,
          resetPasswordCode: null,
          resetPasswordExpires: null,
        },
      )
      .exec();
  }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userService.findByEmail(email);

    if (user && (await bcrypt.compare(pass, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user.toObject();
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = {
      email: user.email,
      sub: user._id,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user_id: user._id,
    };
  }

  async register(createUserDto: CreateUserDto) {
    const user = await this.userService.create(createUserDto);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = user;
    return result;
  }
}
