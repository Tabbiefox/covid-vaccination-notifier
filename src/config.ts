/**
 * Consume .env variables and expose them in `process.env`
 */
import dotenv from 'dotenv';
dotenv.config();

/**
 * Load configuration JSONs from ./config and export them for global use
 */
export {
    config,
    IConfig,
    CovidNotification as ICovidNotificationConfig,
    Notification as ICovidNotificationItemConfig,
    CovidApi as ICovidApiConfig,
    ClickatellApi as IClickatellApiConfig
} from 'node-config-ts';
