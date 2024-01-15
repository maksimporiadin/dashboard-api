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
import { sign } from 'jsonwebtoken';
import { IConfigService } from '../config/config.service.interface';
import { AuthGuard } from '../common/auth.guard';
//import { HTTPError } from "../errors/http-error.class";

@injectable()
export class UserController extends BaseController implements IUserController {
	constructor(
		@inject(TYPES.ILogger) private loggerService: ILogger,
		@inject(TYPES.UserService) private userService: IUserService,
		@inject(TYPES.IConfigService) private configService: IConfigService,
	) {
		super(loggerService);
		this.bindRoutes([
			{
				path: '/register',
				method: 'post',
				func: this.register,
				middlewares: [new ValidateMiddelware(UserRegisterDto)],
			},
			{
				path: '/login',
				method: 'post',
				func: this.login,
				middlewares: [new ValidateMiddelware(UserLoginDto)],
			},
			{
				path: '/info',
				method: 'get',
				func: this.info,
				middlewares: [new AuthGuard()],
			},
			{ path: '/test(_user)?', method: 'get', func: this.test },
		]);
	}

	async login({ body }: Request, res: Response, next: NextFunction): Promise<void> {
		this.loggerService.log(body);
		if (await this.userService.validateUser(body)) {
			const token = await this.signJWT(body.email, this.configService.get('SECRET'));
			this.ok(res, { jwt: token });
		} else {
			this.loggerService.error(`Error login`);
			return next(new HTTPError(401, 'Wrong email or password'));
		}
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
		this.ok(res, { email: newUser.email, id: newUser.id });
	}

	private signJWT(email: string, secret: string): Promise<string> {
		return new Promise((resolve, reject) => {
			sign(
				{
					email,
					iat: Math.floor(Date.now() / 1000),
				},
				secret,
				{
					algorithm: 'HS256',
				},
				(err, token) => {
					if (err) {
						reject(err);
					}

					resolve(token as string);
				},
			);
		});
	}

	async info({ user }: Request, res: Response, next: NextFunction): Promise<void> {
		const userInfo = await this.userService.getUserInfo(user);
		this.ok(res, { email: userInfo?.email, id: userInfo?.id });
	}

	test(req: Request<{}, {}, UserLoginDto>, res: Response, next: NextFunction): void {
		this.loggerService.log('Test GET');
		this.ok(res, 'hello!');
		//next(new HTTPError(400, 'Data error', 'from test request')); test exeption middleware
	}
}
