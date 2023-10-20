import { Injectable } from '@nestjs/common';
import { MessageDTO } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MessageService {
    constructor(private prismaService: PrismaService) { }

    async addMessage(messageDTO: MessageDTO) {
        const result = await this.prismaService.message.create({
            data: {
                chatId: messageDTO.chatId,
                senderId: messageDTO.senderId,
                text: messageDTO.text
            },
        })
        return result
    }
    async getMessages(chatId: number) {
        const result = await this.prismaService.message.findMany({
            where: {
                chatId
            },
        })
        return result
    }
}