import { NextFunction, Request, Response } from 'express';
import { BaseController } from '../common/base.controller';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import 'reflect-metadata';
import { ILogger } from '../logger/logger.interface';
import { IUserController } from './user.controller.interface';
//import { HTTPError } from "../errors/http-error.class";

@injectable()
export class UserController extends BaseController implements IUserController {
    constructor(@inject(TYPES.ILogger) private loggerService: ILogger) {
        super(loggerService);
        this.bindRoutes([
            { path: '/register', method: 'post', func: this.register },
            { path: '/login', method: 'post', func: this.login },
            { path: '/test(_user)?', method: 'get', func: this.test }
        ]);
    }

    login(req: Request, res: Response, next: NextFunction) {
        this.ok(res, 'login');
    }

    register(req: Request, res: Response, next: NextFunction) {
        this.ok(res, 'register');
    }

    test(req: Request, res: Response, next: NextFunction) {
        this.loggerService.log('Test GET');
        this.ok(res, 'hello!');
        //next(new HTTPError(400, 'Data error', 'from test request')); test exeption middleware
    }
}