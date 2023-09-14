/* eslint-disable prettier/prettier */
import { Injectable, NestMiddleware } from '@nestjs/common';
import { User_Types } from 'src/helpers/User_Type';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';
import { ENV } from 'config/environment';

@Injectable()
export class AuthAdminMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}
  use(req: Request, res: Response, next: NextFunction) {
    try {
      if (
        !(
          req.headers.authorization &&
          req.headers.authorization.startsWith('Bearer')
        )
      ) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized user',
        });
      }
      const token = req.headers.authorization.split(' ')[1];
      const verified = this.jwtService.verify(token, {
        secret: ENV.JWT_SECRET_KEY,
      });
      if (verified.hasOwnProperty('user_type') && verified.user_type == User_Types.Admin) {
        next();
      } else {
        res.status(401).json({
          success: false,
          message: 'Authentication failed.',
        });
      }
    } catch (err) {
      if (err.name == 'TokenExpiredError') {
        res.status(401).json({
          success: false,
          message: 'Token is expired',
        });
      }
      if (err.name == 'JsonWebTokenError') {
        res.status(401).json({
          success: false,
          message: 'Unauthorized user',
        });
      }
      if (err.name == 'SyntaxError') {
        console.log(333333333)
        res.status(401).json({
          success: false,
          message: 'Unauthorized user',
        });
      }
      return {
        success: false,
        message: err.message,
      };
    }
  }
}
