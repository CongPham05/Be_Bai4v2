import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { MyJwtGruard } from '../auth/guard';
import { GetUser } from '../auth/decorator';
import { User } from '@prisma/client';

@Controller('user')
export class UserController {

    @UseGuards(MyJwtGruard)
    @Get('me')
    me(@GetUser() user: User) {
        return user;
    }
}
