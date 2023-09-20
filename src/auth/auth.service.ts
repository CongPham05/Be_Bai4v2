import { ConfigService } from '@nestjs/config';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import * as argon from 'argon2';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDTO, LoginDTO } from './dto';
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
        console.log(body)
        const hashedPassword = await argon.hash(body.password);
        try {
            const user = await this.prismaService.user.create({
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
            throw new ForbiddenException('User not found')
        }
        const passwordMatched = await argon.verify(
            user.hashedPassword,
            body.password
        )
        if (!passwordMatched) {
            throw new ForbiddenException('Incorrect password')
        }
        delete user.hashedPassword
        const accessToken = await this.signJwtToken(user.id, user.email)
        res.cookie('accessToken', accessToken)
        return {
            status: HttpStatus.OK,
            user,
            accessToken,
        }
    }
    async signJwtToken(userId: number, email: string): Promise<string> {
        const payload = {
            sub: userId,
            email
        }
        const jwtString = await this.jwtService.signAsync(payload, {
            expiresIn: '1h',
            secret: this.configService.get('JWT_SECRET')
        });
        return jwtString;
    }
}
