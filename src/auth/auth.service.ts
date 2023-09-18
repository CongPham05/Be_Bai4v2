import { ConfigService } from '@nestjs/config';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import * as argon from 'argon2';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDTO, LoginDTO } from './dto';
import { Response } from 'express';
import { HttpStatus } from '@nestjs/common';

@Injectable()
export class AuthService {
    constructor(
        private prismaService: PrismaService,
        private jwtService: JwtService,
        private configService: ConfigService
    ) { }

    async register(body: AuthDTO) {
        const hashedPassword = await argon.hash(body.password);
        try {
            const user = await this.prismaService.user.create({
                data: {
                    email: body.email,
                    hashedPassword,
                    firstName: body.firstName,
                    lastName: body.lastName
                },
                select: {
                    id: true,
                    email: true,
                    createdAt: true
                }
            })
            return {
                status: HttpStatus.CREATED,
                message: "Register successfully",
                error: null
            }
        } catch (error) {
            if (error.code === 'P2002') {
                throw new ForbiddenException('User with this email already exists')
            }
        }
    }
    async login(body: LoginDTO, res: Response) {
        const user = await this.prismaService.user.findUnique({
            where: {
                email: body.email,
            },
            select: { id: true, firstName: true, lastName: true, email: true, hashedPassword: true }
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
        // response.cookie('accessToken', accessToken, { httpOnly: true })
        res.cookie('access-token', accessToken, {
            httpOnly: true,
            sameSite: 'none',
            domain: 'localhost',
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // Hết hạn trong 24 giờ
            path: '/', // Đường dẫn có thể truy cập cookie trên toàn bộ trang web
            secure: true, // Chỉ cho phép truy cập cookie qua HTTPS nếu trình duyệt hỗ trợ
        });
        return {
            status: HttpStatus.OK,
            data: user,
            accessToken,
            message: "Login successfully",
            error: null
        }
    }
    async signJwtToken(userId: number, email: string): Promise<string> {
        const payload = {
            sub: userId,
            email
        }
        return await this.jwtService.signAsync(payload, {
            expiresIn: '1h',
            secret: this.configService.get('JWT_SECRET')
        });
    }
}
