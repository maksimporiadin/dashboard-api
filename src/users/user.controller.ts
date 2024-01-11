import { NextFunction, Request, Response } from "express";
import { BaseController } from "../common/base.controller";
import { LoggerService } from "../logger/logger.service";
//import { HTTPError } from "../errors/http-error.class";

export class UserController extends BaseController {
    constructor(logger: LoggerService) {
        super(logger);
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
        this.ok(res, 'hello!');
        //next(new HTTPError(400, 'Data error', 'from test request')); test exeption middleware
    }
}