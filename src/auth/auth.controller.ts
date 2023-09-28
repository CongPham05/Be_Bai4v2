import { AuthService } from './auth.service';
import { Controller, Post, Body, Res, Get, Req, UseGuards, SetMetadata, Param, Patch } from '@nestjs/common';
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
    forgotPassword(
        @Req() req: Request,
        @Body() body: ForgotPassword
    ) {
        return this.authService.forgotPassword(body, req)
    }


    @Get('token-email/:token')
    tokenMail(@Param() param: { token: string }) {
        return this.authService.tokenMail(param.token)
    }

    @Patch('reset-password')
    resetPassword(@Body() body: { password: string, email: string }) {
        return this.authService.resetPassword(body)
    }
}
