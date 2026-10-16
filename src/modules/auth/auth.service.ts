import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { Admin, AdminDocument } from './admin.schema';
import { LoginDto } from './auth.dto';
@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Admin.name) private admins: Model<AdminDocument>,
    private jwt: JwtService,
  ) {}
  async login(dto: LoginDto) {
    const a = await this.admins.findOne({ username: dto.username, isActive: true });
    if (!a || !(await bcrypt.compare(dto.password, a.passwordHash)))
      throw new UnauthorizedException('Invalid credentials');
    a.lastLoginAt = new Date();
    await a.save();
    return {
      accessToken: this.jwt.sign({ sub: a._id.toString(), username: a.username, role: a.role }),
    };
  }
}
