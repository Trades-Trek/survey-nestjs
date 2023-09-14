import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';


export const AuthUser = createParamDecorator(
  (data: any, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const token=request.headers.authorization.split(' ')[1];
   
    const user=JwtService.prototype.decode(token);
    const userId=user['id']
    return userId;
  },
);