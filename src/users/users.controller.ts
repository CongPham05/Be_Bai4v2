import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, UseGuards } from '@nestjs/common';
import { GetUser, Roles } from '../auth/decorator';
import { User } from '@prisma/client';
import { UserService } from './users.service';
import { AccessJwtGruard, RolesGuard } from '../auth/guard';
import { UpdateUserDTO } from './dto';


@UseGuards(AccessJwtGruard, RolesGuard)
@Controller('users')

export class UserController {
    constructor(private userService: UserService) { }

    @Roles('admin')
    @Get()
    getUsers() {
        return this.userService.getUsers()
    }

    @Roles('admin')
    @Get(':id')
    getUserById(@Param('id', ParseIntPipe) userId: number) {
        return this.userService.getUserById(userId)
    }

    @Roles('admin')
    @Delete()
    deleteUserById(@Param('id', ParseIntPipe) userId: number) {
        return this.userService.deleteUserById(userId)
    }

    @Get('detail')
    detail(@GetUser() user: User) {
        return this.userService.detail(user)
    }

    @Patch(':id')
    updateUserById(
        @Param('id', ParseIntPipe) userId: number,
        @Body() updateUserDTO: UpdateUserDTO) {
        return this.userService.updateUserById(userId, updateUserDTO)
    }
}
