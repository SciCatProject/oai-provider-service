import logger from "../../../server/logger";
import { reject } from "bluebird";
import { MongoClient, Filter } from "mongodb";
import { getCollectionID } from "../../../server/env";
/**
 * This is the DAO service for Scicat. It uses a mongo connection
 * to retrieve data.  Database connection parameters are
 * provided by the credentials file (path defined in .env).
 */
export class MongoConnector {
  public static instance: MongoConnector;
  public db;
  public dbName: string;
  public collectionName: string;
  public mongoDb: MongoClient;

  private constructor() {
    logger.debug("Setting up the mongo connection.");

    const user_url = process.env.DB_USER ? process.env.DB_USER + (
      process.env.DB_PASS? ":" + process.env.DB_PASS : "" ) + "@" : ""
    const db_url = process.env.DATABASE ? "/" + process.env.DATABASE: "" 
    const url = process.env.DB_URL || (user_url + process.env.DB_HOST + ":" + process.env.DB_PORT + db_url);
    this.dbName = process.env.DATABASE;
    this.collectionName = process.env.COLLECTION;

     const  mongoUrl = "mongodb://"+url;
     logger.debug("Creating MongoClient with mongoUrl : "+mongoUrl);
     this.mongoDb = new MongoClient(mongoUrl);

     this.mongoDb.connect()
        .then( client => {
             this.db = client.db(this.dbName);
             logger.debug("Client succefully connected to: "+mongoUrl);
             logger.debug("Client database: "+this.dbName);
           }
        ).catch(
           error => {
              logger.error("Failed to connect to "+mongoUrl+" : "+error.message);
              this.db = null;
           }
        );
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
  public recordsQuery(parameters: any, filter: Filter): Promise<any> {
    if (!this.db) {
      reject("no db connection");
    }
    let Publication = this.db.collection(this.collectionName);
    return Publication.find(filter).toArray() ;
  }

  /**
   * Responds to OAI ListIdentifiers requests.
   * @param parameters
   * @returns {Promise<any>}
   */
  public identifiersQuery(parameters: any, filter: Filter): Promise<any> {
    if (!this.db) {
      reject("no db connection");
    }
    let Publication = this.db.collection(this.collectionName);
    return Publication.find(filter).toArray() ;
  }

  /**
   * Responds to OAI GetRecord requests.
   * @param parameters
   * @returns {Promise<any>}
   */
  public getRecord(parameters: any, filter: Filter): Promise<any> {
    if (!this.db) {
      reject("no db connection");
    }
    let Publication = this.db.collection(this.collectionName);
    const query = {$and: [
        {[`${getCollectionID()}`]: parameters.identifier},
        filter,
      ]
      };
    return Publication.findOne(query);
  }

  private aggregatePublicationQuery(pipeline: any): Promise<any> {
    if (!this.db) {
      reject("no db connection");
    }
    var collection = this.db.collection(this.collectionName);
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

  public putPublication(parameters: any): Promise<any> {
    if (!this.db) {
      reject("no db connection");
    }
    let Publication = this.db.collection(this.collectionName);
    return Publication.insertOne(parameters);
  }

  public updatePublication(parameters: any): Promise<any> {
    if (!this.db) {
      reject("no db connection");
    }
    let Publication = this.db.collection(this.collectionName);
    return Publication.updateOne({ doi: parameters.doi }, {$set: parameters.body });
  }

  public countPublication(parameters: any): Promise<any> {
    if (!this.db) {
      reject("no db connection");
    }
    let Publication = this.db.collection(this.collectionName);
    return Publication.countDocuments(parameters) ;
  }

  // supports skip and limit
  public getPublication(query: any): Promise<any> {
    if (!this.db) {
      reject("no db connection");
    }
    let Publication = this.db.collection(this.collectionName);
      let skip = 0;
      let limit = 0;
      let sort: any;
      if (query && query.skip) {
        skip = parseInt(query.skip);
      }
      if (query && query.limit) {
        limit = parseInt(query.limit);
      }
      if (query && query.sortField) {
        const sortDirectionInt = query.sortDirection === "asc" ? 1 : -1;
        sort = '{ "' + query.sortField + '" : ' + sortDirectionInt + '}';
        sort = JSON.parse(sort);
      }

      const project = this.projectFields(query);

      return Publication.find()
        .skip(skip)
        .limit(limit)
        .sort(sort)
        .project(project)
        .toArray();
  }

  private projectFields(query: any) {
    const project = {}
    if (query && query.excludeFields) {
      query.excludeFields.split('|').reduce((previousValue, currentValue) => (previousValue[currentValue] = 0, previousValue), project);
    }

    if (query && query.includeFields) {
      query.includeFields.split('|').reduce((previousValue, currentValue) => (previousValue[currentValue] = 1, previousValue), project);
    }
    return project;
  }

  public findPublication(query: any): Promise<any> {
    if (!this.db) {
      reject("no db connection");
    }
    let Publication = this.db.collection(this.collectionName);
    return Publication.findOne({ doi: query });
  }
}
