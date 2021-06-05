import { Request, Response, NextFunction } from 'express';

import { HttpError } from '../models/rest-api/httpError.model';
import { serverError } from './error.controller';
// import endpointConfig from '../../util/endpoint.config';


export function getAuthentication(req: Request, res: Response, next: NextFunction) {
    let name: string;
    if (!req.ntlm) {
        throw new HttpError(401, 'Fehlende Authentifizierung');
    }
    const domain = !req.ntlm.DomainName || req.ntlm.DomainName === '.' ? req.ntlm.Workstation : req.ntlm.DomainName;
    name = domain + '\\' + req.ntlm.UserName;
    req.userName = name;
    getUser(name).catch(async (error: Error) => {
        if (error.message !== 'Ungültige Authentifizierung') {
            throw error;
        }
    }).then((user) => {
        req.userName = user.name;
        next();
    }).catch((error: any) => serverError(next, error));
}

async function getUser(name: string): Promise<IUser> {
    const filter = { name };
    const user = await userModel.findOne(filter);
    if (!user) {
        throw new HttpError(401, 'Benutzer hat keine Berechtigung');
    }
    return user;
}
