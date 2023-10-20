import { PrismaService } from 'src/prisma/prisma.service';
import { HttpStatus, Injectable } from '@nestjs/common';
import { ChatDTO } from './dto';

@Injectable()
export class ChatService {
    constructor(private prismaService: PrismaService) { }

    async createChat(chatDTO: ChatDTO) {
        const result = await this.prismaService.chat.findFirst({
            where: {
                members: {
                    hasEvery: [chatDTO.senderId, chatDTO.receiverId]
                },
            },
        });
        if (!result) {
            const result = await this.prismaService.chat.create({
                data: {
                    members: [chatDTO.senderId, chatDTO.receiverId]
                },
            })
            return result;
        }
        return result;
    }
    async userChats(userId: number) {
        const result = await this.prismaService.chat.findMany({
            where: {
                members: {
                    has: userId,
                },
            },
        });
        return result;
    }
    async findChat(firstId: number, secondId: number) {
        const result = await this.prismaService.chat.findFirst({
            where: {
                members: {
                    hasEvery: [firstId, secondId],
                },
            },
        });
        return result;
    }
}
