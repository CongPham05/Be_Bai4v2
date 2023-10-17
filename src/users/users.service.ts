import { ForbiddenException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDTO } from './dto';
import * as argon from 'argon2';

@Injectable()
export class UserService {
    constructor(private prismaService: PrismaService) { }

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

    async updateUserById(userId: number, updateUserDTO: UpdateUserDTO) {
        const { userName, email, oldPassword, password } = updateUserDTO;
        const userModel = await this.prismaService.user.findUnique({
            where: {
                id: userId,
            }
        })
        if (oldPassword && password) {
            const passwordMatched = await argon.verify(
                userModel.hashedPassword,
                oldPassword
            )
            if (!passwordMatched) {
                throw new ForbiddenException('Password old is incorrect')
            }
            const hashedPassword = await argon.hash(password);
            const user = await this.prismaService.user.update({
                where: {
                    id: userId,
                },
                data: {
                    hashedPassword,
                },
            });
            delete user.hashedPassword;
            delete user.createdAt;
            delete user.updatedAt;
            return {
                status: HttpStatus.OK,
                message: "Save successfully",
                user
            };
        }

        const user = await this.prismaService.user.update({
            where: {
                id: userId,
            },
            data: {
                userName: userName,
                email: email,
            },
        });
        delete user.hashedPassword;
        delete user.createdAt;
        delete user.updatedAt;
        return {
            status: HttpStatus.OK,
            message: "Save successfully",
            user
        };
    }

    async getUserById(userId: number) {

    }

    async deleteUserById(userId: number) {

    }

}