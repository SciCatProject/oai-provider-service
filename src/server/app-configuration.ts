export class AppConfiguration {
    private static _instance: AppConfiguration;

    public environment: string = process.env.ENVIRONMENT || "local testing";
    public app_id: string = process.env.APP_ID || "oai_provider_service";
    public log_level: string = process.env.LOG_LEVEL || "debug";
    public version: string = process.env.VERSION || "unknown";
    public admin_user_email: string = process.env.ADMIN_USER_EMAIL || "unknown";
    public published_data_id: string  = process.env.PUBLISHED_DATA_ID || "doi";
    public scicat_backend_url: string = process.env.SCICAT_BACKEND_URL || "unknown";
    public service_url: string = process.env.SERVICE_URL || "http://localhost";
    public service_port: number = +process.env.SERVICE_PORT || 3000;
    public openaire_route: string = process.env.OPENAIRE_ROUTE || "/openaire/oai";
    public scicat_route: string = process.env.SCICAT_ROUTE || "/scicat/oai";
    public panosc_route: string = process.env.PANOSC_ROUTE || "/panosc/oai";
    public service_name: string = process.env.SERVICE_NAME || "oai_provider_service";
    public facility_name: string = process.env.FACILITY_NAME || "unknown";


    private constructor(){}

    public static get instance()
    {
        // Do you need arguments? Make it a regular static method instead.
        return this._instance || (this._instance = new this());
    }
}

