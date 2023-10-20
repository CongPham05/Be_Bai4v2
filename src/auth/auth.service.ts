import { ConfigService } from '@nestjs/config';
import { ForbiddenException, Injectable, HttpStatus } from '@nestjs/common';
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import * as argon from 'argon2';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDTO, LoginDTO, ForgotPassword } from './dto';
import { Response, Request } from 'express';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class AuthService {
    constructor(
        private prismaService: PrismaService,
        private jwtService: JwtService,
        private configService: ConfigService,
        private mailService: MailService
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
                roles: true,
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
    async forgotPassword(body: ForgotPassword, req: Request) {
        const user = await this.prismaService.user.findUnique({
            where: {
                email: body.email
            },
        })
        if (!user) {
            throw new ForbiddenException('That address is either invalid, not a verified primary email or is not associated with a personal user account. ')
        }

        const tokens = await this.getTokens(user.id, user.email)
        await this.mailService.sendMailResetPassword(req, user, tokens.accessToken);
        return {
            message: "Check your email for a link to reset your password. If it doesn’t appear within a few minutes, check your spam folder."
        }
    }
    async tokenMail(token: string) {
        try {
            const decodedToken = await this.jwtService.verifyAsync(
                token,
                {
                    secret: this.configService.get('JWT_ACCESS_SECRET')
                })

            return decodedToken
        } catch (error) {
            return {
                status: HttpStatus.BAD_REQUEST,
                message: "Your link is expired!"
            }
        }
    }


    async resetPassword(body: { password: string, email: string }) {
        const { password, email } = body;
        const hashedPassword = await argon.hash(password);
        await this.prismaService.user.update({
            where: {
                email
            },
            data: {
                hashedPassword
            }
        })
        return {
            message: "Save successfully",
            status: HttpStatus.OK,
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
            expiresIn: '1d',
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
