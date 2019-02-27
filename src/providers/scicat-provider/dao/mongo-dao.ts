import logger from "../../../server/logger";
import { getCredentials, hasCredentialsFile } from "../../core/credentials";

//const express = require('express')
//const app = express()
//const bodyParser = require('body-parser')
const MongoClient = require("mongodb").MongoClient;

/**
 * This is the DAO service for Scicat. It uses a mongo connection
 * to retrieve data.  Database connection parameters are
 * provided by the credentials file (path defined in .env).
 */
export class MongoConnector {
  //private pool: Pool;
  public static instance: MongoConnector;
  public db: null;

  private constructor() {
    logger.debug("Setting up the mongo connection.");

    // Get path from the environment.
    const credFile = process.env.TAGGER_CONFIGURATION;

    /*if (hasCredentialsFile(credFile)) {
      const creds = getCredentials(credFile);
    }*/

    MongoClient.connect("mongodb://localhost:27017", (err, client) => {
      if (err) return console.log(err);
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
    return null;
  }

  /**
   * Responds to OAI ListIdentifiers requests.
   * @param parameters
   * @returns {Promise<any>}
   */
  public identifiersQuery(parameters: any): Promise<any> {
    return null;
  }

  /**
   * Responds to OAI GetRecord requests.
   * @param parameters
   * @returns {Promise<any>}
   */
  public getRecord(parameters: any): Promise<any> {
    return null;
  }

  /**
   * Responds to OAI PutRecord requests.
   * @param parameters
   * @returns {Promise<any>}
   */
  public putRecord(parameters: any): Promise<any> {
    this.db.collection("quotes").save(parameters.req.body, (err, result) => {
      if (err) return console.log(err);

      console.log("saved to database");
      parameters.res.redirect("/");
    });
    return null;
  }
}
