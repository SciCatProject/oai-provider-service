import logger from "../../../server/logger";
import { getCredentials, hasCredentialsFile } from "../../core/credentials";
import { reject } from "bluebird";
import { MongoClient } from "mongodb";

/**
 * This is the DAO service for Scicat. It uses a mongo connection
 * to retrieve data.  Database connection parameters are
 * provided by the credentials file (path defined in .env).
 */
export class MongoConnector {
  public static instance: MongoConnector;
  public db: null;

  private constructor() {
    logger.debug("Setting up the mongo connection.");

    // Get path from the environment.
    const credFile = process.env.SCICAT_CONFIGURATION;

    /*if (hasCredentialsFile(credFile)) {
      const creds = getCredentials(credFile);
    }*/
    const url = "mongodb://localhost:27017";

    MongoClient.connect("mongodb://localhost:27017", (err, client) => {
      if (err) {
        logger.error("failed to connect", err);
        this.db = null;
      }
      this.db = client.db("aoi-publications");
    });
  }

  public static getInstance(): MongoConnector {
    try {
      if (this.instance) {
        return this.instance;
      }
      this.instance = new MongoConnector();
      return this.instance;
    } catch (err) {
      throw new Error("Failed to get MongoConnector instance: " + err.message);
    }
  }

  /**
   * Responds to OAI ListRecords requests.
   * @param parameters
   * @returns {Promise<any>}
   */
  public recordsQuery(parameters: any): Promise<any> {
    if (!this.db) {
      reject("no db connection");
    }
    let Publication = this.db.collection("Publication");
    return new Promise((resolve: any, reject: any) => {
      Publication.find().toArray(function(err, items) {
        if (err) {
          reject(err);
        } else {
          resolve(items);
        }
      });
    });
  }

  /**
   * Responds to OAI ListIdentifiers requests.
   * @param parameters
   * @returns {Promise<any>}
   */
  public identifiersQuery(parameters: any): Promise<any> {
    if (!this.db) {
      reject("no db connection");
    }
    let Publication = this.db.collection("Publication");
    return new Promise((resolve: any, reject: any) => {
      // need to add relevant date to projection
      Publication.find({},{_id: 1 }).toArray(function(err, items) {
        if (err) {
          reject(err);
        } else {
          resolve(items);
        }
      });
    });
  }

  /**
   * Responds to OAI GetRecord requests.
   * @param parameters
   * @returns {Promise<any>}
   */
  public getRecord(parameters: any): Promise<any> {
    if (!this.db) {
      reject("no db connection");
    }
    let Publication = this.db.collection("Publication");
    return new Promise((resolve: any, reject: any) => {
      const query = {
        _id: parameters.identifier
      };
      Publication.findOne(query, {}, function(err, item) {
        if (err) {
          reject(err);
        } else {
          resolve(item);
        }
      });
    });
  }

  private aggregatePublicationQuery(pipeline: any): Promise<any> {
    if (!this.db) {
      reject("no db connection");
    }
    var collection = this.db.collection("Publication");
    var resolve = null;
    return new Promise((resolve: any, err: any) => {
      var resolve = collection.aggregate(pipeline, function(err, cursor) {
        cursor.toArray(function(err, resolve) {
          if (err) {
            logger.error("recordsQuery error:", err);
          }
        });
      });
    });
  }
}
