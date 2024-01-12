import { NextFunction, Request, Response } from 'express';
import { BaseController } from '../common/base.controller';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import 'reflect-metadata';
import { ILogger } from '../logger/logger.interface';
import { IUserController } from './user.controller.interface';
import { UserRegisterDto } from './dto/user-register.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { User } from './user.entity';
import { IUserService } from './user.service.interface';
import { HTTPError } from '../errors/http-error.class';
import { ValidateMiddelware } from '../common/validate.middleware';
//import { HTTPError } from "../errors/http-error.class";

@injectable()
export class UserController extends BaseController implements IUserController {
	constructor(
		@inject(TYPES.ILogger) private loggerService: ILogger,
		@inject(TYPES.UserService) private userService: IUserService,
	) {
		super(loggerService);
		this.bindRoutes([
			{
				path: '/register',
				method: 'post',
				func: this.register,
				middlewares: [new ValidateMiddelware(UserRegisterDto)],
			},
			{ path: '/login', method: 'post', func: this.login },
			{ path: '/test(_user)?', method: 'get', func: this.test },
		]);
	}

	login(req: Request, res: Response, next: NextFunction): void {
		this.ok(res, 'login');
	}

	async register(
		{ body }: Request<{}, {}, UserRegisterDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		this.loggerService.log(body);
		const newUser = await this.userService.createUser(body);
		if (!newUser) {
			return next(new HTTPError(422, 'This user has been already created'));
		}
		this.loggerService.log('UserService', newUser);
		this.ok(res, 'register');
	}

	test(req: Request<{}, {}, UserLoginDto>, res: Response, next: NextFunction): void {
		this.loggerService.log('Test GET');
		this.ok(res, 'hello!');
		//next(new HTTPError(400, 'Data error', 'from test request')); test exeption middleware
	}
}
