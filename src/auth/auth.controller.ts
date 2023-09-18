import { AuthService } from './auth.service';
import { Controller, Post, Body, Res } from '@nestjs/common';
import { AuthDTO, LoginDTO } from './dto';
import { Response } from 'express';



@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('register')
    register(@Body() body: AuthDTO) {
        return this.authService.register(body)
    }

    @Post('login')
    login(
        @Body() body: LoginDTO,
        @Res({ passthrough: true }) res: Response,
    ) {
        return this.authService.login(body, res)
    }
}
