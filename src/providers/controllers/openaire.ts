import {Request, Response} from "express";
import {CoreOaiProvider} from "../core/core-oai-provider";
import logger from "../../server/logger";
import {factory} from "../scicat-provider/repository/scicat-backend";
import {OaiLocalConfiguration} from "../scicat-provider/repository/oaiLocalConfiguration";
import { OpenaireMapper } from "../scicat-provider/repository/openaire-mapper";
import { oaiController } from "./common/oai-controller";


/**
 * This is a CoreOaiProvider instance configured for the sample repository module.
 * Module configuration is provided via constructor parameters.
 * @type {CoreOaiProvider}
 */
const provider = new CoreOaiProvider(
  factory, 
  new OaiLocalConfiguration(), 
  new OpenaireMapper()
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
  logger.debug("Endpoint: panosc/oai");
  oaiController(
    req,
    res,
    provider,
  );
}