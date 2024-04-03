import { BaseService } from "../BaseService";

import { UserManagementInterface} from "../../interfaces/UserManagementInterface";
import { UserManagementExecutorCreator } from "../../executors/UserManagementExecutors/UserManagementExecutorCreator";

import * as OpenApiValidator from 'express-openapi-validator';
import express, { Application, Request, Response, NextFunction } from 'express';
import { initialize } from 'express-openapi';
import bodyParser from 'body-parser';


export class APIService extends BaseService {
    private PORT: number;

    private app: Application = express();

    // Executors
    private userManagementExecutor: UserManagementInterface;

    private initializeExecutors() {
        this.logger.debug("Initializing executors...");

        this.userManagementExecutor = UserManagementExecutorCreator.createUserExecutor();

        // Set up express middleware
        // Set up body parser
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));

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

        this.initializeExecutors();

        this.PORT = PORT;

        initialize({
            app: this.app,
            apiDoc: 'src/services/APIService/apiDoc.yml',
            operations: {
                'CreateUser': this.userManagementExecutor.createUser.bind(this.userManagementExecutor)
            }
        });
    }

    public start() {
        this.app.listen(this.PORT);
    }
}

