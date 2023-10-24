import { ChatService } from './chat.service';
import { Body, Controller, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { AccessJwtGruard } from 'src/auth/guard';
import { ChatDTO } from './dto';


@UseGuards(AccessJwtGruard)
@Controller('chat')
export class ChatController {

    constructor(private chatService: ChatService) { }

    @Post()
    createChat(@Body() chatDTO: ChatDTO) {
        return this.chatService.createChat(chatDTO)
    }
    @Get(":userId")
    userChats(@Param("userId", ParseIntPipe) userId: number) {
        return this.chatService.userChats(userId)
    }
    @Get(":firstId/:secondId")
    findChat(@Param("firstId", ParseIntPipe) firstId: number, @Param("secondId", ParseIntPipe) secondId: number) {
        return this.chatService.findChat(firstId, secondId)
    }

}
