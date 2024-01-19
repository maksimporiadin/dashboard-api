import 'reflect-metadata';
import { Container } from 'inversify';
import { IConfigService } from '../config/config.service.interface';
import { IUserRepository } from './user.repository.interface';
import { IUserService } from './user.service.interface';
import { TYPES } from '../types';
import { UserService } from './user.service';
import { UserModel } from '@prisma/client';

const ConfigServiceMok: IConfigService = {
	get: jest.fn(),
};

const UserRepositoryMok: IUserRepository = {
	find: jest.fn(),
	create: jest.fn(),
};

const container = new Container();
let configService: IConfigService;
let userRepository: IUserRepository;
let userService: IUserService;

beforeAll(() => {
	container.bind<IUserService>(TYPES.UserService).to(UserService);
	container.bind<IConfigService>(TYPES.IConfigService).toConstantValue(ConfigServiceMok);
	container.bind<IUserRepository>(TYPES.IUserRepository).toConstantValue(UserRepositoryMok);

	configService = container.get<IConfigService>(TYPES.IConfigService);
	userRepository = container.get<IUserRepository>(TYPES.IUserRepository);
	userService = container.get<IUserService>(TYPES.UserService);
});

let createdUser: UserModel | null;

describe('User Service', () => {
	it('createUser', async () => {
		configService.get = jest.fn().mockReturnValueOnce('10');
		userRepository.create = jest.fn().mockImplementationOnce((user: UserModel) => ({
			name: user.name,
			email: user.email,
			password: user.password,
			id: 1,
		}));
		createdUser = await userService.createUser({
			email: 'test@test.com',
			name: 'Test',
			password: '1',
		});

		expect(createdUser?.id).toEqual(1);
		expect(createdUser?.password).not.toEqual(1);
	});

	it('validateUser - success', async () => {
		userRepository.find = jest.fn().mockReturnValueOnce(createdUser);
		const res = await userService.validateUser({ email: 'test@test.com', password: '1' });

		expect(res).toBeTruthy;
	});

	it('validateUser - wrong password', async () => {
		userRepository.find = jest.fn().mockReturnValueOnce(createdUser);
		const res = await userService.validateUser({ email: 'test@test.com', password: '2' });

		expect(res).toBeFalsy;
	});

	it('validateUser - wrong user', async () => {
		userRepository.find = jest.fn().mockReturnValueOnce(null);
		const res = await userService.validateUser({ email: 'test1@test.com', password: '1' });

		expect(res).toBeFalsy;
	});
});
