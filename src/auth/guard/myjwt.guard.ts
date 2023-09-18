import { AuthGuard } from '@nestjs/passport';


export class MyJwtGruard extends AuthGuard('jwt') {

}