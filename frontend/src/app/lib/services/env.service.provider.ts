import { EnvService } from './env.service';

interface EnvWindow extends Window {
    __env?: {
        apiBaseUrl?: string;
        authUrl?: string;
        backendBaseUrl?: string;
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
                env.apiBaseUrl = browserWindow.__env.apiBaseUrl ?? env.apiBaseUrl;
                env.authUrl = browserWindow.__env.authUrl ?? env.authUrl;
                env.backendBaseUrl = browserWindow.__env.backendBaseUrl ?? env.backendBaseUrl;
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
