import { config, ConnectionPool, Request } from 'mssql';
import { EnvironmentController } from '../controllers/environment.controller';

const env = EnvironmentController.instance;

const sqlConfig: config = {
    user: env.dbUser,
    password: env.dbPassword,
    database: env.dbName,
    server: env.dbServer,
    port: +env.dbPort,
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    },
    options: {
        instanceName: env.dbInstance,
        encrypt: false, // for azure
        trustServerCertificate: true // change to true for local dev / self-signed certs
    }
}

const poolPromise = new ConnectionPool(sqlConfig);

export const pool = poolPromise
    .connect()
    .then(pool => {
        console.debug('Connected to', sqlConfig.server, sqlConfig.options?.instanceName, sqlConfig.database);
        return pool;
    }).catch(err => {
        console.error('Database Connection Failed! Bad Config: ', err)
        return undefined;
    });

export const requestPromise = pool.then(connection => new Request(connection));

// preflight check if connection works and all tables and stored procedures exist
export const checkDatabase = async () => {
    const expectedTables = [
        'BoatExt_Authorizations',
        'BoatExt_Contracts',
        'BoatExt_PriceCategories',
        'BoatExt_Budgets',
        'BoatExt_Deliverables'
    ];
    const req = await requestPromise;
    try {
        let result = (await req.query('select TABLE_NAME from INFORMATION_SCHEMA.TABLES')).recordset.map(r => r.TABLE_NAME as string);
        expectedTables.forEach(t => {
            if (!result.includes(t)) {
                throw new Error('Missing table ' + t);
            }
        });
        const expectedProcedures = [
            'BoatExt_Import'
        ];
        result = (await req.query(
            'select ROUTINE_NAME from INFORMATION_SCHEMA.ROUTINES WHERE ROUTINE_TYPE = \'PROCEDURE\'')).recordset.map(r => r.ROUTINE_NAME as string);
        expectedProcedures.forEach(p => {
            if (!result.includes(p)) {
                throw new Error('Missing procedure ' + p);
            }
        });
    } catch (error) {
        console.log(error);
        return false;
    }
    return true;
}

// testing only: delete database contents before starting test
export const deleteDatabaseContents = async () => {
    const req = await requestPromise;
    try {
        let result = await req.query('TRUNCATE TABLE [BoatExt_Deliverables];');
        result = await req.query('TRUNCATE TABLE [BoatExt_Budgets];');
        result = await req.query('DELETE FROM [BoatExt_PriceCategories];');
        result = await req.query('DELETE FROM [BoatExt_Contracts];');
        result = await req.query('TRUNCATE TABLE [BoatExt_Authorizations]')
    } catch (error) {
        console.log(error);
        return false;
    }
    return true;
};

// testing only: close database connection
export const disconnectDatabase = async () => {
    try {
        await poolPromise.close();
        console.log('Connection to database closed!');
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}

// not necessary for mssql, but intersting
export const dateTimeToSql = (date: Date) => date.toISOString().slice(0, 19).replace('T', ' ');
