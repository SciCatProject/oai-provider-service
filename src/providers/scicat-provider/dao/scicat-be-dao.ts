import logger from "../../../server/logger";
import { Configuration, PublishedDataApi, PublishedDataControllerFindAllRequest, PublishedDataControllerFindOneRequest } from "@scicatproject/scicat-sdk-ts-fetch";
import { AppConfiguration } from "../../../server/app-configuration"

/**
 * This is the DAO service for Scicat. 
 * It uses the SciCat BE instance running to retrieve the published data.
 */
export class SciCatBEConnector {
  public static instance: SciCatBEConnector;
  public publishedDataApi: PublishedDataApi;
  public scicatUrl: string;
  public publishedDataCount: number;
  private aconf: AppConfiguration;

  private constructor() {

    logger.debug("Setting up scicat client.");

    this.aconf = AppConfiguration.instance;

    this.scicatUrl = this.aconf.scicat_backend_url;
    if (this.scicatUrl == "") {
      logger.error("SciCat Backend URL should be defined")
      throw new Error("SciCat Backend URL should be defined")
    }
    logger.info("SciCat url: " + this.scicatUrl);

    if (!this.publishedDataApi) {

      const apiConfig = new Configuration({
        basePath: this.scicatUrl,
      });

      this.publishedDataApi = new PublishedDataApi(apiConfig);

      this.publishedDataApi.publishedDataControllerCount()
        .then( (res) =>{
          this.publishedDataCount = res.count;
        })
        .catch( (error) => {
          logger.error("Failed to connect to SciCat :", error.message);
          throw error;
        });
      
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
    const filters: PublishedDataControllerFindOneRequest = {
      id: parameters.identifier,
    };
    return this.publishedDataApi.publishedDataControllerFindOne(filters);
  }

  public countPublication(parameters: any): Promise<any> {
    return this.publishedDataApi.publishedDataControllerCount()
  }

}
