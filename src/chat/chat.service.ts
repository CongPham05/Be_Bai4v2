import { PrismaService } from 'src/prisma/prisma.service';
import { HttpStatus, Injectable } from '@nestjs/common';
import { MessageDTO } from './dto';

@Injectable()
export class ChatService {
    constructor(private prismaService: PrismaService) { }

    async create(userId: number, messageDTO: MessageDTO) {

        const result = await this.prismaService.message.create({
            data: {
                content: messageDTO.content,
                userId
            }
        })

        return {
            status: HttpStatus.OK,
            message: "Add message successfully",
            result
        };
    }
    async findAll() {

    }
}
