import { Request, Response } from "express";
import {
  CoreOaiProvider,
  EXCEPTION_CODES,
  ExceptionParams,
} from "../core/core-oai-provider";
import { generateException } from "../core/oai-response";
import logger from "../../server/logger";
import { factory } from "../scicat-provider/repository/scicat-data-repository";
import { Configuration } from "../scicat-provider/repository/configuration";
import { ScicatDcMapper } from "../scicat-provider/repository/scicat-dc-mapper";
import { MongoConnector } from "../scicat-provider/dao/mongo-dao"; // only for put method

/**
 * This is a CoreOaiProvider instance configured for the sample repository module.
 * Module configuration is provided via constructor parameters.
 * @type {CoreOaiProvider}
 */
const provider = new CoreOaiProvider(
  factory,
  new Configuration(),
  new ScicatDcMapper()
);

/**
 * This controller handles all OAI requests to the sample module.
 *
 * OAI exceptions that result from successful request processing are returned in
 * the Response with status code 200. The Promises will reject when unexpected
 * processing errors occur. These rejections are handled by returning an OAI
 * exception with a 500 status code. That seems to be the best approach
 * to exception handling, but might need to be revised if we learn otherwise.
 * @param {Request} req
 * @param {Response} res
 */
export let oai = (req: Request, res: Response) => {
  res.set("Content-Type", "text/xml");
  logger.debug("Request:", req.query);
  switch (req.query.verb) {
    case "Identify":
      logger.debug("Identify request.");
      provider
        .identify(req.query)
        .then((response) => {
          res.send(response);
        })
        .catch((oaiError) => {
          res.status(500);
          res.send(oaiError);
        });

      break;

    case "ListMetadataFormats":
      logger.debug("ListMetadataFormats request.");
      provider
        .listMetadataFormats(req.query)
        .then((response) => {
          res.send(response);
        })
        .catch((oaiError) => {
          res.status(500);
          res.send(oaiError);
        });

      break;

    case "ListIdentifiers":
      logger.debug("ListIdentifiers request.");
      provider
        .listIdentifiers(req.query)
        .then((response) => {
          res.send(response);
        })
        .catch((oaiError) => {
          res.status(500);
          res.send(oaiError);
        });

      break;

    case "ListRecords":
      logger.debug("ListRecords request.");
      provider
        .listRecords(req.query)
        .then((response) => {
          res.send(response);
        })
        .catch((oaiError) => {
          res.status(500);
          res.send(oaiError);
        });

      break;

    case "ListSets":
      logger.debug("ListSets request.");
      provider
        .listSets(req.query)
        .then((response) => {
          res.send(response);
        })
        .catch((oaiError) => {
          res.status(500);
          res.send(oaiError);
        });
      break;

    case "GetRecord":
      logger.debug("GetRecord request.");
      provider
        .getRecord(req.query)
        .then((response) => {
          res.send(response);
        })
        .catch((oaiError) => {
          res.status(500);
          res.send(oaiError);
        });

      break;

    default:
      const exception: ExceptionParams = {
        baseUrl: req.protocol + "://" + req.get("host") + req.path,
      };
      res.send(generateException(exception, EXCEPTION_CODES.BAD_VERB));
  }
};

export let putPublication = (req: Request, res: Response) => {
  logger.debug("Put publication request.");
  const dao = MongoConnector.getInstance();
  dao
    .putPublication(req.body)
    .then((response) => {
      res.send(response);
    })
    .catch((oaiError) => {
      res.status(500);
      res.send(oaiError);
    });
};

export let updatePublication = (req: Request, res: Response) => {
  logger.debug(
    "Update publication request.",
    decodeURIComponent(req.params.id),
  );
  const dao = MongoConnector.getInstance();
  const doi = decodeURIComponent(req.params.id);
  const body = req.body;
  const params = { doi, body}
  dao
    .updatePublication(params)
    .then((response) => {
      res.send(response);
    })
    .catch((oaiError) => {
      logger.debug(
        "Failed to update publication.");
      res.status(500);
      res.send(oaiError);
    });
};

export let countPublication = (req: Request, res: Response) => {
  logger.debug("Count publications request.");
  const dao = MongoConnector.getInstance();
  dao
    .countPublication(null)
    .then((count) => {
      res.send({ count });
    })
    .catch((oaiError) => {
      res.status(500);
      res.send(oaiError);
    });
};

// is commonly a cross origin request
export let getPublication = (req: Request, res: Response) => {
  logger.debug("Get publications request. ", req.params.limits);

  const limits = req.params.limits;
  let params = parseParams(limits);

  const dao = MongoConnector.getInstance();
  dao
    .getPublication(params)
    .then((response) => {
      res.send(response);
    })
    .catch((oaiError) => {
      res.status(500);
      res.send(oaiError);
    });
};

// is commonly a cross origin request
export let findPublication = (req: Request, res: Response) => {
  logger.debug("Find publications request.", decodeURIComponent(req.params.id));
  // need to decode doi parameter from URL
  const dao = MongoConnector.getInstance();
  const doi = decodeURIComponent(req.params.id);
  dao
    .findPublication(doi)
    .then((response) => {
      res.send(response);
    })
    .catch((oaiError) => {
      res.status(500);
      res.send(oaiError);
    });
};

export const parseParams = (limits: string) => {
  let params = null;
  if (limits) {
    // decode limits string and convert to JSON
    const parts = decodeURIComponent(limits)
      .replace(/[()]/g, "")
      .replace(/"/g, '\\"')
      .replace(/&/g, '","')
      .replace(/=/g, '":"');
    let partsArr = parts.split(",");
    partsArr.forEach(function (part, index) {
      this[index] = '"' + this[index].replace(/[:]/g, ":") + '"';
    }, partsArr);

    params = JSON.parse("{" + partsArr.join(",") + "}");
  }
  return params;
}
