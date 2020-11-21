import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginModel } from 'src/login/login.model';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const bcrypt = require('bcrypt');

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  generateJWT(login: LoginModel) {
    return this.jwtService.signAsync({ login });
  }

  async hashPassword(password: string) {
    const hashedPassword: string = await bcrypt.hash(password, 12);
    return hashedPassword;
  }

  comparePasswords(newPassword: string, passwordHash: string) {
    return bcrypt.compare(newPassword, passwordHash);
  }
}
