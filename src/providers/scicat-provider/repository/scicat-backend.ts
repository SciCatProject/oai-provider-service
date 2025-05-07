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

/**
 * @typedef {Object} record
 * @property {number}id
 * @property {string} title
 * @property {string} image
 * @property {string} url
 * @property {string} browseType
 * @property {string} description
 * @property {string} dates
 * @property {string} items
 * @property {string} ctype
 * @property {string} repoType
 * @property {string} restricted
 * @property {boolean} published
 * @property {string} createdAt
 * @property {string} updatedAt
 * @property {string} searchUrl
 */

import {
  DataRepository,
  ERRORS,
  METADATA_FORMAT_DC
} from "../../core/core-oai-provider";
import logger from "../../../server/logger";
import { SciCatBEConnector } from "../dao/scicat-be-dao";

/**
 * Factory function to create the oai provider
 * @param {Object} [options={}] - Implementation-specific configuration
 * @returns {DataRepository}
 */

export enum METADATA_FORMAT_PANOSC {
  prefix = "panosc",
  schema = "https://github.com/panosc-eu/fair-data-api/blob/master/panosc.xsd",
  namespace = "http://scicat.esss.se/panosc"
}

export enum METADATA_FORMAT_OAI_DATACITE {
  prefix = "oai_datacite",
  schema = "http://schema.datacite.org/meta/kernel-3/metadata.xsd",
  namespace = "http://datacite.org/schema/kernel-3"
}

export enum SETS {
  setspec = "openaire_data",
  setname = "openaire_data"
}

export function factory(options = {}): DataRepository {
  const dao: SciCatBEConnector = SciCatBEConnector.getInstance();

  return Object.freeze({
    /**
     * Defines whether this repository supports sets.
     */
    setSupport: true,

    /**
     * Defines whether this repository supports resumption tokens.
     */
    resumptionSupport: false,

    /**
     * Get individual record.
     * @param parameters (identifier, metadataPrefix)
     * @returns {Promise<any>} Resolves with a {@link record}
     */
    getRecord: (parameters: any) => {
      return dao.getRecord(parameters);
    },

    /**
     * Returns the metadata formats supported by this repository (DC only)
     * @param {string} identifier (not used)
     * @returns {Promise<METADATA_FORMAT_DC[]>}
     */

    getMetadataFormats: (identifier: string = undefined) => {
      // Since only DC is supported, safe to ignore the identifier param.
      return Promise.resolve([
        METADATA_FORMAT_DC,
        METADATA_FORMAT_PANOSC,
        METADATA_FORMAT_OAI_DATACITE
      ]);
    },

    /**
     * Used to retrieve the set structure of a repository. Not supported currently.
     * @param {string} resumptionToken
     * @returns {Promise<never>}
     */

    getSets: (identifier: string = undefined) => {
      return Promise.resolve([SETS]);
    },

    /**
     * Gets list of identifiers.
     * @param parameters (metadataPrefix, from (optional), until (optional), set (not supported),
     *        resumptionToken (not supported))
     * @returns {Promise<any>} an array of {@link record}
     */
    getIdentifiers: (parameters: any) => {
      return dao.identifiersQuery(parameters);
    },

    /**
     * Gets list of records
     * @param parameters (metadataPrefix, from (optional), until (optional), set (not supported),
     *        resumptionToken (not supported))
     * @returns {Promise<any>} an array of {@link record}
     */
    getRecords: (parameters: any) => {
      return dao.recordsQuery(parameters);
    }
  });
}
