import { ChatService } from './chat.service';
import { Controller, UseGuards } from '@nestjs/common';
import { AccessJwtGruard } from 'src/auth/guard';


@UseGuards(AccessJwtGruard)
@Controller('chat')
export class ChatController {
    constructor(private chatService: ChatService) { }

    // ()
    // addChat(
    //     @GetUser('id') usesId: number,
    //     @Body() messageDTO: MessageDTO
    // ) {
    //     return this.chatService.addChat(usesId, messageDTO)
    // }

}
