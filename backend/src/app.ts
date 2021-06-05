import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import express = require('express');
import ntlm = require('express-ntlm');
import cors = require('cors');
import { ConnectionPool } from 'mssql';

import { error404 } from './controllers/error.controller';
import { getAuthentication } from './controllers/authentication.controller';
import { HttpError } from './models/rest-api/httpError.model';
import { EnvironmentController } from './controllers/environment.controller';

const app = express();
export let connectionPool: ConnectionPool;
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

const sqlConfig = {
    user: env.dbUser,
    password: env.dbPassword,
    database: env.dbName,
    server: env.dbServer,
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    },
    options: {
        encrypt: true, // for azure
        trustServerCertificate: true // change to true for local dev / self-signed certs
    }
}

const connectSql = async () => {
    console.log('starting');
    try {
        // make sure that any items are correctly URL encoded in the connection string
        connectionPool = await new ConnectionPool(sqlConfig).connect();
        const result = await connectionPool.query('select * from INFORMATION_SCHEMA.TABLES');
        console.dir(result)
        const server = app.listen(8000);
        exp = server;
        
    } catch (err) {
        console.log(err)
    }
}

connectSql();

export default () => exp;

