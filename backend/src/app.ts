import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import express = require('express');
import ntlm = require('express-ntlm');
import cors = require('cors');

import { error404 } from './controllers/error.controller';
import { getAuthentication } from './controllers/authentication.controller';
import { HttpError } from './models/rest-api/httpError.model';
import { EnvironmentController } from './controllers/environment.controller';
import { checkDatabase } from './models/db';

const app = express();
let exp: any;

const env = EnvironmentController.instance;

app.use(cors(), ntlm({
    // debug: function() {
    // const args = Array.prototype.slice.apply(arguments);
    // console.log(args);
    // },
    domain: env.ldapDomain,
    domaincontroller: env.ldapServer,
}));

app.use('/rest', express.json(), getAuthentication,);

app.use('/', error404);

app.use((error: ErrorRequestHandler, req: Request, res: Response, next: NextFunction) => {
    const status = error instanceof HttpError ? error.httpStatusCode : 500;
    const message = error instanceof HttpError ? error.message : error.toString();
    const data = error instanceof HttpError && error.data ? error.data : undefined;
    res.status(status).json({message, data});
});

checkDatabase().then(() => {
    const server = app.listen(8000);
    exp = server;
});

export default () => exp;

