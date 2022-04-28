import logger from "../../../server/logger";
import { reject } from "bluebird";
import { MongoClient } from "mongodb";
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

  private constructor() {
    logger.debug("Setting up the mongo connection.");

    const user_url = process.env.DB_USER ? process.env.DB_USER + (
      process.env.DB_PASS? ":" + process.env.DB_PASS : "" ) + "@" : ""
    const db_url = process.env.DATABASE ? "/" + process.env.DATABASE: "" 
    const url = process.env.DB_URL || (user_url + process.env.DB_HOST + ":" + process.env.DB_PORT + db_url);
    this.dbName = process.env.DATABASE;
    this.collectionName = process.env.COLLECTION;

    MongoClient.connect("mongodb://" + url, { useUnifiedTopology: true }, (err, client) => {
      if (err) {
        logger.error("failed to connect", err);
        this.db = null;
      }
      this.db = client.db(this.dbName);
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
    let Publication = this.db.collection(this.collectionName);
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
    let Publication = this.db.collection(this.collectionName);
    return new Promise((resolve: any, reject: any) => {
      // need to add relevant date to projection
      Publication.find({}, { _id: 1 }).toArray(function(err, items) {
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
    let Publication = this.db.collection(this.collectionName);
    return new Promise((resolve: any, reject: any) => {
      const query = {
        [`${getCollectionID()}`]: parameters.identifier
        
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
    return new Promise((resolve: any, reject: any) => {
      Publication.insertOne(parameters, {}, function(err, item) {
        if (err) {
          reject(err);
        } else {
          resolve(item);
        }
      });
    });
  }

  public updatePublication(parameters: any): Promise<any> {
    if (!this.db) {
      reject("no db connection");
    }
    let Publication = this.db.collection(this.collectionName);
    return new Promise((resolve: any, reject: any) => {
      Publication.updateOne({ doi: parameters.doi }, {$set: parameters.body }, function(err, item) {
        if (err) {
          reject(err);
        } else {
          resolve(item);
        }
      });
    });
  }

  public countPublication(parameters: any): Promise<any> {
    if (!this.db) {
      reject("no db connection");
    }

    let Publication = this.db.collection(this.collectionName);
    return new Promise((resolve: any, reject: any) => {
      Publication.countDocuments(parameters, {}, function(err, count) {
        if (err) {
          reject(err);
        } else {
          resolve(count);
        }
      });
    });
  }

  // supports skip and limit
  public getPublication(query: any): Promise<any> {
    if (!this.db) {
      reject("no db connection");
    }
    let Publication = this.db.collection(this.collectionName);
    return new Promise((resolve: any, reject: any) => {
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


      Publication.find({})
        .skip(skip)
        .limit(limit)
        .sort(sort)
        .toArray(function(err, result) {
          if (err) {
            logger.debug("Mongo Error. ", err);
            reject(err);
          } else {
            resolve(result);
          }
        });
    });
  }

  public findPublication(query: any): Promise<any> {
    if (!this.db) {
      reject("no db connection");
    }
    let Publication = this.db.collection(this.collectionName);
    return new Promise((resolve: any, reject: any) => {
      Publication.findOne({ doi: query }, {}, function(err, item) {
        if (err) {
          reject(err);
        } else {
          resolve(item);
        }
      });
    });
  }
}
