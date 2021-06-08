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

export const pool = new ConnectionPool(sqlConfig)
    .connect()
    .then(pool => {
        console.debug('Connected to', sqlConfig.server, sqlConfig.options?.instanceName, sqlConfig.database);
        return pool;
    }).catch(err => {
        console.error('Database Connection Failed! Bad Config: ', err)
        return undefined;
    });

export const checkDatabase = async () => {
    const expectedTables = [
        'BoatExt_Contracts',
        'BoatExt_PriceCategories',
        'BoatExt_PriceCategoriesForContract',
        'BoatExt_Deliverables'
    ];
    const connection = await pool;
    const request = new Request(connection);
    const result = (await request.query('select TABLE_NAME from INFORMATION_SCHEMA.TABLES')).recordset.map(r => r.TABLE_NAME as string);
    expectedTables.forEach(t => {
        if (!result.includes(t)) {
            throw new Error('Missing table ' + t);
        }
    });
    const expectedProcedures = [
        'BoatExt_Import'
    ];
    const procResult = (await request.query(
        'select ROUTINE_NAME from INFORMATION_SCHEMA.ROUTINES WHERE ROUTINE_TYPE = \'PROCEDURE\'')).recordset.map(r => r.ROUTINE_NAME as string);
    expectedProcedures.forEach(p => {
        if (!procResult.includes(p)) {
            throw new Error('Missing procedure ' + p);
        }
    })
    console.debug('Database ready!');

}