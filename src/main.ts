import { Container, ContainerModule, interfaces } from 'inversify';
import { App } from './app';
import { ExeptionsFilter } from './errors/exeption.filter';
import { LoggerService } from './logger/logger.service';
import { UserController } from './users/user.controller';
import { ILogger } from './logger/logger.interface';
import { TYPES } from './types';
import { IExeptionFilter } from './errors/exeption.filter.interface';
import { IUserController } from './users/user.controller.interface';

const appBindings = new ContainerModule((bind: interfaces.Bind) => {
    bind<ILogger>(TYPES.ILogger).to(LoggerService);
    bind<IExeptionFilter>(TYPES.IExeptionFilter).to(ExeptionsFilter);
    bind<IUserController>(TYPES.UserController).to(UserController);
    bind<App>(TYPES.Aplication).to(App);
});

function bootstrap() {
    const appContainer = new Container();
    appContainer.load(appBindings);
    const app = appContainer.get<App>(TYPES.Aplication);
    app.init();
    return { app, appContainer }
}

export const { app, appContainer } = bootstrap();