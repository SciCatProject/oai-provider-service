/*
 *  Original work Copyright 2018 Willamette University 
 *  Modified work Copyright 2019 SciCat Organisations
 *
 *  This file is part of OAI-PHM Service.
 *  
 *  @author Michael Spalti
 *
 *  OAI-PHM Service is based on the Modular OAI-PMH Server, University of Helsinki, 
 *  The National Library of Finland.
 *
 *  OAI-PHM Service is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  OAI-PHM Service is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of 
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with OAI-PHM Service.  If not, see <http://www.gnu.org/licenses/>.
 */

import {generateException, generateResponse} from "./oai-response";
import { getCollectionID } from "../../server/env";
import {OaiService, ProviderConfiguration} from './oai-service';
import logger from "../../server/logger";

interface Formats {
    prefix: string;
    schema: string;
    namespace: string;
}

export interface StatusFilter {
    status: string ;
}

/**
 * The time formats that can be returned with OAI Identify requests.
 */
export enum HARVESTING_GRANULARITY {
    DATE = 'YYYY-MM-DD',
    DATETIME = 'YYYY-MM-DDThh:mm:ssZ'
}

/**
 * The standard OAI responses for deleted record support that can be
 * returned with OAI Identify requests.
 */
export enum DELETED_RECORDS_SUPPORT {
    NO = 'no',
    TRANSIENT = 'transient',
    PERSISTENT = 'persistent'
}

// Not actually returning these as error codes.
// Using the verb name.
export enum ERRORS {
    badArgument = 0,
    badResumptionToken = 1,
    badVerb = 2,
    cannotDisseminateFormat = 4,
    idDoesNotExist = 8,
    noRecordsMatch = 16,
    noMetadataFormats = 32,
    noSetHierarchy = 64
}

/**
 * OAI definition for the Dublin Core metatdata format.
 */
export enum METADATA_FORMAT_DC {
    prefix = 'oai_dc',
    schema = 'http://www.openarchives.org/OAI/2.0/oai_dc.xsd',
    namespace = 'http://www.openarchives.org/OAI/2.0/oai_dc/'
}

/**
 * Interface for the class that maps between DAO data and
 * formatted OAI xml.
 */
export abstract class ProviderDCMapper {
    route: string;
    get collection_id(): string {return getCollectionID()};
    abstract mapOaiDcListRecords(records: any[]): any;

    abstract mapOaiDcGetRecord(records: any): any;

    abstract mapOaiDcListIdentifiers(records: any[]): any;
    abstract mapOaiDcListSets(records: any[]): any;

}

/**
 * The list of possible query parameters that may need to be
 * returned in OAI exceptions.
 */
export interface ExceptionParams {
    baseUrl: string;
    verb?: VERBS;
    identifier?: string;
    metadataPrefix?: string
}

/**
 * OAI verbs.
 */
export enum VERBS {
    IDENTIFY = 'Identify',
    LIST_METADATA_FORMATS = 'ListMetadataFormats',
    LIST_SETS = 'ListSets',
    GET_RECORD = 'GetRecord',
    LIST_IDENTIFIERS = 'ListIdentifiers',
    LIST_RECORDS = 'ListRecords'
}

/**
 * The OAI codes returned in exceptions.
 */
export enum EXCEPTION_CODES {
    BAD_ARGUMENT = "badArgument",
    BAD_RESUMPTION_TOKEN = "badResumptionToken",
    BAD_VERB = "badVerb",
    CANNOT_DISSEMINATE_FORMAT = "cannotDisseminateFormat",
    ID_DOES_NOT_EXIST = "idDoesNotExist",
    NO_RECORDS_MATCH = "noRecordsMatch",
    NO_METADATA_FORMATS = "noMetadataFormats",
    NO_SET_HIERARCHY = "noSetHierarchy"
}

/**
 * Implemented by OAI repository modules.
 */
export interface DataRepository {
    setSupport: boolean,
    resumptionSupport: boolean,
    getSets: any;
    getRecords: any;
    getMetadataFormats: any;
    getIdentifiers: any;
    getRecord: any;
}

/**
 * Parameters for OAI list requests (ListRecords and ListIdentifiers).
 */
export interface ListParameters {
    metadataPrefix: string;
    from?: string;
    until?: string;
    set?: string;
    resumptionToken?: string;
}

/**
 * The parameters required by OAI GetRecord requests.
 */
export interface RecordParamters {
    identifier: string;
    metadataPrefix: string;
}

/**
 * The optional parameter for OAI GetMetadataFormats requests.
 */
export interface MetadataFormatParameters {
    identifier?: string;
}

/**
 * The core OAI provider class instantiates an `OaiService` that has been configured with
 * a single data repository module.
 */
export class CoreOaiProvider {

    oaiService: OaiService;
    parameters: ProviderConfiguration;
    mapper: ProviderDCMapper;
    possibleParams = ['verb', 'from', 'until', 'metadataPrefix', 'set', 'resumptionToken'];

    /**
     * The constructor initializes the core provider with a single provider module.
     * @param factory the provider module's factory method
     * @param {ProviderConfiguration} the provider module configuration
     * @param {ProviderDCMapper} the provider module mapper (typically maps to Dublin Core)
     */
    constructor(factory: any,
                configuration: ProviderConfiguration,
                mapper: ProviderDCMapper) {

        this.oaiService = new OaiService(factory, configuration);
        this.parameters = this.oaiService.getParameters();
        this.mapper = mapper;
        this.parameters.baseURL += this.mapper.route;
    }

    /**
     * Handle OAI requests. These methods return OAI provider configuration,
     * data, or error responses from the repository provider module that has been
     * configured in `OaiService`.
     */

    /**
     * Handles `ListMetatadataFormats` requests using the current repository module.
     * @param {MetadataFormatParameters} query
     * @returns {Promise<string>}
     */
    listMetadataFormats(query: MetadataFormatParameters): Promise<string> {

        logger.debug('ListMetadataFormats');

        return new Promise((resolve: any, reject: any) => {
            const queryParameters = this.getQueryParameters(query);
            const exception: ExceptionParams = {
                baseUrl: this.parameters.baseURL,
                verb: VERBS.LIST_METADATA_FORMATS,
                metadataPrefix: METADATA_FORMAT_DC.prefix
            };
            if (queryParameters.length > 2 || (queryParameters.length === 2 &&
                    !this.hasKey(query, 'identifier'))) {
                resolve(generateException(exception, EXCEPTION_CODES.BAD_ARGUMENT));
            } else {
                const args = this.hasKey(query, 'identifier') ? query.identifier : undefined;
                this.oaiService.getProvider().getMetadataFormats(args).then((formats: any[]) => {
                    try {
                        const responseContent = {
                            ListMetadataFormats: formats.map((format: Formats) => {
                                return {
                                    metadataFormat: [
                                        {metadataPrefix: format.prefix},
                                        {schema: format.schema},
                                        {metadataNamespace: format.namespace}
                                    ]
                                };
                            })
                        };

                        resolve(generateResponse(<any>query, this.parameters.baseURL, responseContent));

                    } catch (err) {
                        logger.error(err);
                        reject(generateException(exception, EXCEPTION_CODES.NO_METADATA_FORMATS));
                    }
                });
            }
        });
    }

    /**
     * Handles `GetRecord` requests using the current repository module.
     * @param {RecordParamters} query
     * @returns {Promise<string>}
     */
    getRecord(query: RecordParamters): Promise<string> {

        logger.debug('GetRecord');
        return new Promise((resolve: any, reject: any) => {
            const queryParameters = this.getQueryParameters(query);
            const exception: ExceptionParams = {
                baseUrl: this.parameters.baseURL,
                verb: VERBS.GET_RECORD,
                identifier: query.identifier,
                metadataPrefix: METADATA_FORMAT_DC.prefix
            };
            if (queryParameters.length !== 3 ||
                !this.hasKey(query, 'identifier') ||
                !this.hasKey(query, 'metadataPrefix')) {
                resolve(generateException(exception, EXCEPTION_CODES.BAD_ARGUMENT));

            } else {
               
                this.oaiService.getProvider().getRecord(query)
                    .then((record: any) => {
                        try {
                            if (record) {
                                const mapped = this.mapper.mapOaiDcGetRecord(record);
                                resolve(generateResponse(<any>query, this.parameters.baseURL, mapped))
                            } else {
                                // There should be one matching record.
                                resolve(generateException(exception, EXCEPTION_CODES.ID_DOES_NOT_EXIST));
                            }
                        } catch (err) {
                            logger.error(err);
                            reject(generateException(exception, EXCEPTION_CODES.ID_DOES_NOT_EXIST));
                        }
                    })
                    .catch((err: Error) => {
                        logger.error(err);
                        // If dao query errs, return OAI error.
                        reject(generateException(exception, EXCEPTION_CODES.ID_DOES_NOT_EXIST));
                    });
            }
        });
    }

    /**
     * Handles `ListIdentifiers` requests using the current repository module.
     * @param {ListParameters} query
     * @returns {Promise<string>}
     */
    listIdentifiers(query: ListParameters): Promise<string> {

        logger.debug('ListIdentifiers');

        return new Promise((resolve: any, reject: any) => {

            const queryParameters = this.getQueryParameters(query);
            const exception: ExceptionParams = {
                baseUrl: this.parameters.baseURL,
                verb: VERBS.LIST_IDENTIFIERS,
                metadataPrefix: METADATA_FORMAT_DC.prefix
            };

            // Valid parameter count.
            if ((queryParameters.length > 6 || queryParameters.length < 2)) {
                resolve(generateException(exception, EXCEPTION_CODES.BAD_ARGUMENT));

            }
            // Verify that query parameters are valid for this repository.
            if (this.hasInvalidListParameter(queryParameters, query)) {
                resolve(generateException(exception, EXCEPTION_CODES.BAD_ARGUMENT));
            }

            // If set is requested, verify that it is supported by this repository.
            if (this.hasKey(query, 'set')) {
                if (!this.hasSetSupport()) {
                    resolve(generateException(exception, EXCEPTION_CODES.NO_SET_HIERARCHY));
                }
            }
            // Execute the request.
            this.oaiService.getProvider().getIdentifiers(query)
                .then((result: any) => {
                    if (result.length === 0) {
                        resolve(generateException(exception, EXCEPTION_CODES.NO_RECORDS_MATCH));
                    }
                    try {
                        const mapped = this.mapper.mapOaiDcListIdentifiers(result);
                        resolve(generateResponse(<any>query, this.parameters.baseURL, mapped))

                    } catch (err) {
                        // Log the error and return OAI error message.
                        logger.error(err);
                        reject(generateException(exception, EXCEPTION_CODES.NO_RECORDS_MATCH));
                    }

                })
                .catch((err: Error) => {
                    logger.error(err);
                    // If dao query fails, return OAI error.
                    reject(generateException(exception, EXCEPTION_CODES.NO_RECORDS_MATCH));
                });


        });
    }


    /**
     * Handles `ListRecords` requests using the current repository module.
     * @param {ListParameters} query
     * @returns {Promise<any>}
     */
    listRecords(query: ListParameters): Promise<any> {

        logger.debug('ListRecords', query);

        return new Promise((resolve: any, reject: any) => {
                const queryParameters = this.getQueryParameters(query);
                const exception: ExceptionParams = {
                    baseUrl: this.parameters.baseURL,
                    verb: VERBS.LIST_RECORDS,
                    metadataPrefix: METADATA_FORMAT_DC.prefix
                };

                // Valid parameter count.
                if ((queryParameters.length > 6 || queryParameters.length < 2)) {
                    resolve(generateException(exception, EXCEPTION_CODES.BAD_ARGUMENT));

                }
                // Verify that query parameters are valid for this repository.
                if (this.hasInvalidListParameter(queryParameters, query)) {
                    resolve(generateException(exception, EXCEPTION_CODES.BAD_ARGUMENT));
                }

                // If set is requested, verify that it is supported by this repository.
                if (this.hasKey(query, 'set')) {
                    if (!this.hasSetSupport()) {
                        resolve(generateException(exception, EXCEPTION_CODES.NO_SET_HIERARCHY));
                    }
                }
                // Execute the request.
                this.oaiService.getProvider().getRecords(query)
                    .then((result: any) => {
                        if (result.length === 0) {
                            resolve(generateException(exception, EXCEPTION_CODES.NO_RECORDS_MATCH));

                        }
                        try {
                            const mapped = this.mapper.mapOaiDcListRecords(result);
                            resolve(generateResponse(<any>query, this.parameters.baseURL, mapped));

                        } catch (err) {
                            // Log the error and return OAI error message.
                            logger.error(err);
                            reject(generateException(exception, EXCEPTION_CODES.NO_RECORDS_MATCH));

                        }

                    })
                    .catch((err: Error) => {
                        logger.error(err);
                        // If dao query fails, return OAI error.
                        reject(generateException(exception, EXCEPTION_CODES.NO_RECORDS_MATCH));

                    });

            }
        );
    }

    /**
     * Handles `Identify` requests using the current repository module.
     * @param {any} query
     * @returns {Promise<any>}
     */
    identify(query: any): Promise<any> {

        logger.debug("Identify");

        return new Promise((resolve: any, reject: any) => {
            const queryParameters = this.getQueryParameters(query);
            const exception: ExceptionParams = {
                baseUrl: this.parameters.baseURL,
                verb: VERBS.IDENTIFY
            };
            try {
                if (queryParameters.length > 1) {
                    resolve(generateException(exception, EXCEPTION_CODES.BAD_ARGUMENT));
                } else {
                    const responseContent = {
                        Identify: [
                            {repositoryName: this.parameters.repositoryName},
                            {baseURL: this.parameters.baseURL},
                            {protocolVersion: this.parameters.protocolVersion},
                            {adminEmail: this.parameters.adminEmail},
                            {earliestDatestamp: this.parameters.earliestDatestamp},
                            {deletedRecord: this.parameters.deletedRecord},
                            {granularity: this.parameters.granularity}
                        ]
                    };
                    resolve(generateResponse(query, this.parameters.baseURL, responseContent));
                }
            } catch (err) {
                logger.log(err);
                reject(generateException(exception, EXCEPTION_CODES.BAD_ARGUMENT));
            }
        });
    }

    /**
     * Handles `ListSets` requests using the current repository module.
     * @param {any} query
     * @returns {Promise<any>}
     */
    listSets(query: any): Promise<any> {
        /**
         * Parameters: resumptionToken (exclusive)
         * exceptions: badArgument, badResumptionToken, noSetHierarchy
         */
        return new Promise((resolve: any, reject: any) => {
            const queryParameters = this.getQueryParameters(query);
            const exception: ExceptionParams = {
                baseUrl: this.parameters.baseURL,
                verb: VERBS.LIST_SETS
            };
            /*if (queryParameters.length > 2 || (queryParameters.length === 2 &&
                    !this.hasKey(query, 'resumptionToken'))) {
                resolve(generateException(exception, EXCEPTION_CODES.BAD_ARGUMENT));
            } else {*/
                const mapped = this.mapper.mapOaiDcListSets(null)
                resolve(generateResponse(<any>query, this.parameters.baseURL, mapped));
           /* }*/
        });
    }

    /**
     * Checks for key on the queryParameters object.
     * @param {object}
     * @param {string}
     * @returns {boolean}
     */
    private hasKey(queryParameters: object, key: string): boolean {
        return Object.prototype.hasOwnProperty.call(queryParameters, key);
    }

    /**
     * Gets the query parameters provided by the http Request.
     * @param query
     * @returns {any[]}
     */
    private getQueryParameters(query: any) {
        return Object.keys(query).map(key => query[key]);
    }

    /**
     * Validates that we have valid from and until value.
     * @param parameters
     * @returns {boolean}
     */
    private hasValidSelectiveParams(parameters: any): boolean {
        if (parameters.until) {
            if (!parameters.from) {
                return false;
            }
            return parseInt(parameters.from) <= parseInt(parameters.until);
        }
        return true;
    }

    private hasSetSupport(): boolean {
        return this.oaiService.getProvider().setSupport;
    }

    private hasResumptionTokenSupport(): boolean {
        return this.oaiService.getProvider().resumptionSupport;
    }

    private isNotRecognizedParameter(query: any): boolean {
        return (!Object.keys(query).every(key => this.possibleParams.indexOf(key) >= 0));
    }

    private hasExclusiveParameterViolation(queryParameters: any, query: any) {
        return (queryParameters.length === 2 && (!this.hasKey(query, 'metadataPrefix') &&
            !this.hasKey(query, 'resumptionToken')))
    }

    private hasInvalidListParameter(queryParameters: any, query: any): boolean {

        if (this.isNotRecognizedParameter(query)) {
            return true;

        } else if (this.hasKey(query, 'resumptionToken')) {
            if (!this.hasResumptionTokenSupport()) {
                return true;
            }

        } else if (this.hasExclusiveParameterViolation(queryParameters, query)) {
            return true;

        } else if (!this.hasValidSelectiveParams(query)) {
            return true;

        }
        return false;
    }

}
