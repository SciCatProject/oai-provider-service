import {Request, Response} from "express";
import {CoreOaiProvider, EXCEPTION_CODES, ExceptionParams} from "../core/core-oai-provider";
import {generateException} from "../core/oai-response";
import logger from "../../server/logger";
import {factory} from "../scicat-provider/repository/scicat-data-repository";
import {Configuration} from "../scicat-provider/repository/configuration";
import { OpenaireMapper } from "../scicat-provider/repository/openaire-mapper";
const MongoClient = require("mongodb").MongoClient;


/**
 * This is a CoreOaiProvider instance configured for the sample repository module.
 * Module configuration is provided via constructor parameters.
 * @type {CoreOaiProvider}
 */
const provider = new CoreOaiProvider(factory, new Configuration(), new OpenaireMapper());

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
    res.set('Content-Type', 'text/xml');

    switch (req.query.verb) {

        case 'Identify':
            logger.debug('Identify request.');
            provider.identify(req.query)
                .then((response) => {
                    res.send(response);
                })
                .catch((oaiError) => {
                    res.status(500);
                    res.send(oaiError);
                });

            break;

        case 'ListMetadataFormats':
            logger.debug('ListMetadataFormats request.');
            provider.listMetadataFormats(req.query)
                .then((response) => {
                    res.send(response);
                })
                .catch((oaiError) => {
                    res.status(500);
                    res.send(oaiError);
                });

            break;

        case 'ListIdentifiers':
            logger.debug('ListIdentifiers request.');
            provider.listIdentifiers(req.query)
                .then((response) => {
                    res.send(response)
                })
                .catch((oaiError) => {
                    res.status(500);
                    res.send(oaiError)
                });

            break;

        case 'ListRecords':
            logger.debug('ListRecords request.');
            provider.listRecords(req.query)
                .then((response) => {
                    res.send(response)
                })
                .catch((oaiError) => {
                    res.status(500);
                    res.send(oaiError)
                });

            break;

        case 'ListSets':
            logger.debug('ListSet request.');
            provider.listSets(req.query)
                .then((response) => {
                    res.send(response)
                })
                .catch((oaiError) => {
                    res.status(500);
                    res.send(oaiError)
                });
            break;

        case 'GetRecord':
            logger.debug('GetRecord request.');
            provider.getRecord(req.query)
                .then((response) => {
                    res.send(response)
                })
                .catch((oaiError) => {
                    res.status(500);
                    res.send(oaiError)
                });

            break;

        default:
            const exception: ExceptionParams = {
                baseUrl: req.protocol + '://' + req.get('host') +  req.path
            };
            res.send(generateException(exception, EXCEPTION_CODES.BAD_VERB));
    }

};
