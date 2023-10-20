import { Module } from '@nestjs/common';
import { UserModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { TodoModule } from './todo/todos.module';
import { MailModule } from './mail/mail.module';
import { EventsModule } from './events/events.module';
import { ChatModule } from './chat/chat.module';
import { MessageModule } from './message/message.module';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UserModule,
    AuthModule,
    PrismaModule,
    TodoModule,
    MailModule,
    EventsModule,
    ChatModule,
    MessageModule,
  ],
  controllers: [],
  providers: [
    // {
    //   provide: APP_GUARD,
    //   useClass: MyJwtGruard,
    // },
    // {
    //   provide: APP_GUARD,
    //   useClass: RolesGuard,
    // }
  ],
})
export class AppModule { }
