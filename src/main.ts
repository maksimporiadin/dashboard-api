import { App } from './app';
import { ExeptionsFilter } from './errors/exeption.filter';
import { LoggerService } from './logger/logger.service';
import { UserController } from './users/user.controller';

async function bootstrap() {
    const logger = new LoggerService();
    const app = new App(
        logger, 
        new UserController(logger), 
        new ExeptionsFilter(logger)
    );
    await app.init();
}

bootstrap()