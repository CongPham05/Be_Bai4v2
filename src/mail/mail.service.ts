import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { Request } from 'express';

interface User {
    email: string;
    userName: string;
}

@Injectable()
export class MailService {
    constructor(private mailerService: MailerService) { }

    async sendMailResetPassword(req: Request, user: User, token: string) {

        const host = req.header('Referer');
        const url = `${host}password_reset?token=${token}&email=${user.email}`;

        await this.mailerService.sendMail({
            to: user.email,
            subject: '[XuKA] Please reset your password',
            template: './confirmation',
            context: {
                name: user.userName,
                url,
            },
        });
    }
}
