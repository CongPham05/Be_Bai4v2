import { AuthService } from './auth.service';
import { Controller, Post, Body, Res, Get, Req, UseGuards, SetMetadata } from '@nestjs/common';
import { RegisterDTO, LoginDTO, ForgotPassword } from './dto';
import { Response, Request } from 'express';
import { RefreshTokenGuard } from './guard';


@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('register')
    register(@Body() body: RegisterDTO) {
        return this.authService.register(body)
    }

    @Post('login')
    login(
        @Body() body: LoginDTO,
        @Res({ passthrough: true }) res: Response,
    ) {
        return this.authService.login(body, res)
    }

    @UseGuards(RefreshTokenGuard)
    @Post('refresh-token')
    refreshTokens(@Req() req: Request) {
        const userId = req.user['sub'];
        return this.authService.refreshTokens(userId)
    }

    @Post('forgot-password')
    forgotPassword(@Body() body: ForgotPassword) {
        return this.authService.forgotPassword(body)
    }
}
