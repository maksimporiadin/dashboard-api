import { Container, ContainerModule, interfaces } from 'inversify';
import { App } from './app';
import { ExeptionsFilter } from './errors/exeption.filter';
import { LoggerService } from './logger/logger.service';
import { UserController } from './users/user.controller';
import { ILogger } from './logger/logger.interface';
import { TYPES } from './types';
import { IExeptionFilter } from './errors/exeption.filter.interface';
import { IUserController } from './users/user.controller.interface';
import { IUserService } from './users/user.service.interface';
import { UserService } from './users/user.service';
import { IConfigService } from './config/config.service.interface';
import { ConfigService } from './config/config.service';
import { PrismaService } from './database/prisma.service';
import { IUserRepository } from './users/user.repository.interface';
import { UserRepository } from './users/users.repository';

const appBindings = new ContainerModule((bind: interfaces.Bind) => {
	bind<ILogger>(TYPES.ILogger).to(LoggerService).inSingletonScope();
	bind<IExeptionFilter>(TYPES.IExeptionFilter).to(ExeptionsFilter);
	bind<IUserController>(TYPES.UserController).to(UserController);
	bind<IUserRepository>(TYPES.IUserRepository).to(UserRepository);
	bind<PrismaService>(TYPES.PrismaService).to(PrismaService);
	bind<IUserService>(TYPES.UserService).to(UserService);
	bind<IConfigService>(TYPES.IConfigService).to(ConfigService).inSingletonScope();
	bind<App>(TYPES.Aplication).to(App);
});

interface IBootstrap {
	appContainer: Container;
	app: App;
}

function bootstrap(): IBootstrap {
	const appContainer = new Container();
	appContainer.load(appBindings);
	const app = appContainer.get<App>(TYPES.Aplication);
	app.init();
	return { app, appContainer };
}

export const { app, appContainer } = bootstrap();
