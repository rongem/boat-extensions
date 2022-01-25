import { EnvService } from './env.service';

interface EnvWindow extends Window {
    __env?: {
        apiBaseUrl?: string;
        authUrl?: string;
        backendBaseUrl?: string;
        headerText?: string;
    }
}

export const EnvServiceFactory = () => {  
    // Create env
    const env = new EnvService();

    // Read environment variables from browser window
    const browserWindow = window as EnvWindow || {};
    if (browserWindow.__env) {
        const browserWindowEnv: any = browserWindow.__env || {};

        for (const key in browserWindowEnv) {
            if (browserWindowEnv.hasOwnProperty(key)) {
                let backendUrl = browserWindow.__env.backendBaseUrl ?? env.backendBaseUrl;
                if (!backendUrl.endsWith('/'))
                {
                    backendUrl += '/';
                }
                env.apiBaseUrl = browserWindow.__env.apiBaseUrl ?? env.apiBaseUrl;
                env.authUrl = browserWindow.__env.authUrl ?? env.authUrl;
                env.backendBaseUrl = backendUrl;
                env.headerText = browserWindow.__env.headerText ?? env.headerText;
            }
        }
    }

  return env;
};

export const EnvServiceProvider = {  
  provide: EnvService,
  useFactory: EnvServiceFactory,
  deps: [],
};
