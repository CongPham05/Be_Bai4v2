import { HttpStatus, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDTO } from './dto';

@Injectable()
export class UserService {
    constructor(
        private prismaService: PrismaService,
    ) { }

    async detail(user: User) {
        return {
            status: HttpStatus.OK,
            user
        }
    }

    async getUsers() {
        const users = await this.prismaService.user.findMany({
            select: {
                id: true,
                email: true,
                userName: true,
                roles: true
            }
        });
        return { users };
    }

    async getUserById(userId: number) {

    }


    async updateUserById(userId: number, updateUserDTO: UpdateUserDTO
    ) {


    }

    async deleteUserById(userId: number) {

    }

}