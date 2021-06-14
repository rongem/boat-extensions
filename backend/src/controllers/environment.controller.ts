export class EnvironmentController {
    private constructor() {
        if (!this.dbName) {
            throw new Error('Umgebungsvariable DB_NAME wurde nicht gefunden.');
        }
        if (!this.dbUser) {
            throw new Error('Umgebungsvariable DB_USER wurde nicht gefunden.');
        }
        if (!this.dbPassword) {
            throw new Error('Umgebungsvariable DB_PWD wurde nicht gefunden.');
        }
        if (!this.dbServer) {
            throw new Error('Umgebungsvariable DB_SERVER wurde nicht gefunden.');
        }
        if (!this.ldapDomain) {
            throw new Error('Umgebungsvariable LDAP_DOMAIN wurde nicht gefunden.');
        }
        if (!this.ldapServer) {
            throw new Error('Umgebungsvariable LDAP_SERVER wurde nicht gefunden.');
        }
        if (!['ntlm', 'none'].includes(this.authMode)) {
            throw new Error('Ungültige Authentifzierungsmethode: ' + this.authMode);
        }
    }

    private static _instance = new EnvironmentController();
    static get instance() {
        return this._instance;
    }

    get dbName() {
        return process.env.DB_NAME ?? '';
    }

    get dbUser() {
        return process.env.DB_USER ?? '';
    }

    get dbPassword() {
        return process.env.DB_PWD ?? '';
    }

    get dbServer() {
        return process.env.DB_SERVER ?? '';
    }

    get dbPort() {
        return process.env.DB_PORT ?? '1433';
    } 

    get dbInstance() {
        return process.env.DB_INSTANCE ?? '';
    }

    get corsOrigin() {
        return process.env.CORS_ORIGIN ?? '*';
    }

    get authMode() {
        return (process.env.AUTH_MODE ?? 'ntlm').toLocaleLowerCase();
    }

    get ldapDomain() {
        return process.env.LDAP_DOMAIN ?? '';
    }

    get ldapServer() {
        return process.env.LDAP_SERVER ?? '';
    }
}