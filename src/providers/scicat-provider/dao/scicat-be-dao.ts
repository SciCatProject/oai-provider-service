import logger from "../../../server/logger";
import { Configuration, PublishedDataApi, PublishedDataControllerFindAllRequest, PublishedDataControllerFindOneRequest } from "@scicatproject/scicat-sdk-ts-fetch";

/**
 * This is the DAO service for Scicat. It uses a mongo connection
 * to retrieve data.  Database connection parameters are
 * provided by the credentials file (path defined in .env).
 */
export class SciCatBEConnector {
  public static instance: SciCatBEConnector;
  public publishedDataApi: PublishedDataApi;
  public scicatUrl: string;
  public publishedDataCount: number;

  private constructor() {

    logger.debug("Setting up scicat client.");

    this.scicatUrl = process.env.SCICAT_BACKEND_URL ? process.env.SCICAT_BACKEND_URL : "http://my.scicat.backend";

    if (!this.publishedDataApi) {

      const apiConfig = new Configuration({
        basePath: this.scicatUrl,
      });

      this.publishedDataApi = new PublishedDataApi(apiConfig);

      let publishedDataCount = -1;
      this.publishedDataApi.publishedDataControllerCount()
        .then( (res) =>{
          publishedDataCount = res.count;
        })
        .catch( (error) => {
          logger.error("Failed to connect to SciCat");
          logger.error(error.message);
          throw error;
        });
      this.publishedDataCount = publishedDataCount; 
      
    }
  }

  public static getInstance(): SciCatBEConnector {
    try {
      if (this.instance) {
        return this.instance;
      }
      this.instance = new SciCatBEConnector();
      return this.instance;
    } catch (err) {
      throw new Error("Failed to get SciCAtBEConnector instance: " + err.message);
    }
  }

  /**
   * Responds to OAI ListRecords requests.
   * @param parameters
   * @returns {Promise<any>}
   */
  public recordsQuery(parameters: any,): Promise<any> {
    if (!this.publishedDataApi) {
      throw new Error("No connection to SciCAt instance.");
    }
    const filters: PublishedDataControllerFindAllRequest = {
      filter: JSON.stringify({
        "where":{"status":"registered"},
      }),
      fields: "{}",
    };
    return this.publishedDataApi.publishedDataControllerFindAll(filters);
  }

  /**
   * Responds to OAI ListIdentifiers requests.
   * @param parameters
   * @returns {Promise<any>}
   */
  public identifiersQuery(parameters: any): Promise<any> {
    if (!this.publishedDataApi) {
      throw new Error("No connection to SciCAt instance.");
    }
    const filters: PublishedDataControllerFindAllRequest = {
      filter: JSON.stringify({
        "where":{"status":"registered"},
      }),
      fields: "{}",
    };
    return this.publishedDataApi.publishedDataControllerFindAll(filters)
      .then( (res) => {
        return res.map((item) =>{
          return item.doi;
        })
      });
  }

  /**
   * Responds to OAI GetRecord requests.
   * @param parameters
   * @returns {Promise<any>}
   */
  public getRecord(parameters: any): Promise<any> {
    if (!this.publishedDataApi) {
      throw new Error("No connection to SciCAt instance.");
    }
    const filters: PublishedDataControllerFindOneRequest = {
      id: parameters.identifier,
    };
    return this.publishedDataApi.publishedDataControllerFindOne(filters);
  }

  public countPublication(parameters: any): Promise<any> {
    if (!this.publishedDataApi) {
      throw new Error("No connection to SciCAt instance.");
    }
    return this.publishedDataApi.publishedDataControllerCount()
  }

}
