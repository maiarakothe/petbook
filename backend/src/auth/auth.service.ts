import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { PrismaService } from '../database/prisma.service';

import { LoginDto } from './dto/login.dto';
import { CreateUsuarioDto } from '../usuarios/dto/create-usuario.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) { }

  async register(dto: CreateUsuarioDto) {
    const usuarioExistente = await this.prisma.usuario.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (usuarioExistente) {
      throw new ConflictException(
        'Este email já está cadastrado',
      );
    }

    const senhaHash = await bcrypt.hash(dto.senha, 10);

    const usuario = await this.prisma.usuario.create({
      data: {
        nome: dto.nome,
        email: dto.email,
        senha: senhaHash,
      },
    });

    return {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
    };
  }

  async login(dto: LoginDto) {
    const usuario = await this.prisma.usuario.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (!usuario) {
      throw new UnauthorizedException(
        'Email ou senha inválidos',
      );
    }

    const senhaValida = await bcrypt.compare(
      dto.senha,
      usuario.senha,
    );

    if (!senhaValida) {
      throw new UnauthorizedException(
        'Email ou senha inválidos',
      );
    }

    const token = await this.jwtService.signAsync({
      sub: usuario.id,
      email: usuario.email,
    });

    return {
      access_token: token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
      },
    };
  }

  async updateProfile(usuarioId: string, dto: { nome: string; email: string }) {
    try {
      return await this.prisma.usuario.update({
        where: { id: usuarioId },
        data: { nome: dto.nome, email: dto.email },
        select: { id: true, nome: true, email: true },
      });
    } catch (error) {
      if (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Este email já está cadastrado');
      }
      throw error;
    }
  }
}