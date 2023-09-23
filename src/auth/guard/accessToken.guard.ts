import { AuthGuard } from '@nestjs/passport';


export class AccessJwtGruard extends AuthGuard('jwt') { }
