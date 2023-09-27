import { ConfigService } from '@nestjs/config';
import { ForbiddenException, Injectable, Delete } from '@nestjs/common';
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import * as argon from 'argon2';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDTO, LoginDTO, ForgotPassword } from './dto';
import { Response } from 'express';
import { HttpStatus } from '@nestjs/common';

@Injectable()
export class AuthService {
    constructor(
        private prismaService: PrismaService,
        private jwtService: JwtService,
        private configService: ConfigService
    ) { }

    async register(body: RegisterDTO) {
        const hashedPassword = await argon.hash(body.password);
        try {
            await this.prismaService.user.create({
                data: {
                    userName: body.userName,
                    email: body.email,
                    hashedPassword,
                },
            })
            return {
                status: HttpStatus.CREATED,
                message: "Register successfully",
            }
        } catch (error) {
            if (error.code === 'P2002') {
                if (error.meta.target == 'userName') {
                    throw new ForbiddenException(`Name already exists`)
                }
                throw new ForbiddenException(`Email already exists`)
            }
        }
    }
    async login(body: LoginDTO, res: Response) {
        const user = await this.prismaService.user.findUnique({
            where: {
                email: body.email,
            },
            select: {
                id: true,
                email: true,
                userName: true,
                hashedPassword: true,
            }
        })
        if (!user) {
            throw new ForbiddenException('User or password is incorrect')
        }
        const passwordMatched = await argon.verify(
            user.hashedPassword,
            body.password
        )
        if (!passwordMatched) {
            throw new ForbiddenException('User or password is incorrect')
        }
        delete (user.hashedPassword)
        const tokens = await this.getTokens(user.id, user.email)
        return {
            user,
            tokens
        }
    }
    async forgotPassword(body: ForgotPassword) {
        const user = await this.prismaService.user.findUnique({
            where: {
                email: body.email
            }
        })
        if (!user) {
            throw new ForbiddenException('That address is either invalid, not a verified primary email or is not associated with a personal user account. ')
        }
        return {
            message: "Check your email for a link to reset your password. If it doesn’t appear within a few minutes, check your spam folder."
        }

    }
    async refreshTokens(userId: number) {
        const user = await this.prismaService.user.findUnique({
            where: {
                id: userId,
            },
        })
        if (!user) {
            throw new ForbiddenException('Access Denied')
        }
        const tokens = await this.getTokens(user.id, user.email);
        return tokens;
    }

    private async getTokens(userId: number, email: string): Promise<{ accessToken: string; refreshToken: string; }> {
        const payload = {
            sub: userId,
            email
        }
        const accessToken = await this.jwtService.signAsync(payload, {
            expiresIn: '15s',
            secret: this.configService.get('JWT_ACCESS_SECRET')
        });
        const refreshToken = await this.jwtService.signAsync(payload, {
            expiresIn: '7d',
            secret: this.configService.get('JWT_REFRESH_SECRET')
        });
        return {
            accessToken,
            refreshToken,
        };
    }
}
