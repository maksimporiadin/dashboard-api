import express, { Express } from 'express';
import { Server } from 'http';
import { userRouter } from './users/users';
import { LoggerService } from './logger/logger.service';
import { UserController } from './users/user.controller';

export class App {
    app: Express;
    server: Server;
    port: number;
    logger: LoggerService;
    userController: UserController;

    constructor(logger: LoggerService, userController: UserController) {
        this.app = express();
        this.port = 8000;
        this.logger = logger;
        this.userController = userController;
    }

    private useRoutes() {
        this.app.use('/users', this.userController.router);
    }

    public async init() {
        this.useRoutes();
        this.server = this.app.listen(this.port, () => {
            this.logger.log(`Server is running on http://localhost:${this.port}`);
        });
    }
}