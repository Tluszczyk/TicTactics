import { BaseService } from "../BaseService";

import { UserManagementService } from "../UserManagementService/UserManagementService";
import { AuthorisationService } from "../AuthorisationService/AuthorisationService";
import { GameManagementService } from "../GameManagementService/GameManagementService";

import * as OpenApiValidator from 'express-openapi-validator';
import express, { Application, Request, Response, NextFunction } from 'express';
import { initialize } from 'express-openapi';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';


export class APIService extends BaseService {
    private PORT: number;

    private app: Application = express();

    // Services
    private userManagementService: UserManagementService = new UserManagementService();
    private authorisationService: AuthorisationService = new AuthorisationService();
    private gameManagementService: GameManagementService = new GameManagementService();

    public getApp() {
        return this.app;
    }

    /**
     * Set up express middleware including body parser, cookie parser, OpenAPI validator, and error handling middleware
     */
    private setUpMiddleware() {

        // Set up express middleware
        // Set up body parser
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));

        // Set up cookie parser
        this.app.use(cookieParser());

        // Set up OpenAPI validator
        this.app.use(OpenApiValidator.middleware({ 
            apiSpec: 'src/services/APIService/apiDoc.yml',
            validateRequests: true,
            validateResponses: true
        }));

        // Set up error handling middleware
        this.app.use((err: any, req: Request, res: Response, next: NextFunction) => {
            // Handle validation errors from express-openapi-validator
            if (err.status && err.errors) {
                res.status(err.status).json({
                    message: err.message,
                    errors: err.errors,
                });
            } else {
                next(err);
            }
        });
    }

    constructor(PORT: number) {
        super();

        this.setUpMiddleware();
        this.PORT = PORT;

        const userManagementExecutor:   Function = this.userManagementService.executor.bind(this.userManagementService)
        const authorisationExecutor:    Function = this.authorisationService.executor.bind(this.authorisationService)
        const gameManagementExecutor:   Function = this.gameManagementService.executor.bind(this.gameManagementService)

        initialize({
            app: this.app,
            apiDoc: 'src/services/APIService/apiDoc.yml',
            operations: {
                // Authorisation
                'SignUp':           authorisationExecutor(this.authorisationService.signUp,         "signUp",           false),
                'SignIn':           authorisationExecutor(this.authorisationService.signIn,         "signIn",           false),
                'SignOut':          authorisationExecutor(this.authorisationService.signOut,        "signOut",          true),
                'DeleteAccount':    authorisationExecutor(this.authorisationService.deleteAccount,  "deleteAccount",    true),

                // User Management
                'GetUsers':         userManagementExecutor(this.userManagementService.getUsers,     "getUsers",         true),

                // Game Management
                'CreateGame':       gameManagementExecutor(this.gameManagementService.createGame,   "createGame",       true),
                'ListGames':        gameManagementExecutor(this.gameManagementService.listGames,    "listGames",        true),
                'JoinGame':         gameManagementExecutor(this.gameManagementService.joinGame,     "joinGame",         true),
                'LeaveGame':        gameManagementExecutor(this.gameManagementService.leaveGame,    "leaveGame",        true)
            }
        });
    }

    public start() {
        this.app.listen(this.PORT);
    }
}

