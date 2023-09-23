import { ConfigService } from '@nestjs/config';
import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt"
import { PrismaService } from '../../prisma/prisma.service'


@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(
        configService: ConfigService,
        private prismaService: PrismaService,
    ) {
        super({
            //token string is added to every request (except login / register)
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.get('JWT_ACCESS_SECRET')
        });
    }
    async validate(payload: { sub: number; email: string }) {

        const user = await this.prismaService.user.findUnique({
            where: { id: payload.sub },
        })
        return user;
    }
}