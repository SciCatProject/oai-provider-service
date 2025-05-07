/*
 *  Copyright 2018 Willamette University
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

import {DELETED_RECORDS_SUPPORT, HARVESTING_GRANULARITY} from "../../core/core-oai-provider";
import {ProviderConfiguration} from "../../core/oai-service";

/**
 * module configuration.
 */
export class OaiLocalConfiguration implements ProviderConfiguration {

    public repositoryName: string = "Scicat Provider";
    public baseURL: string =  process.env.SERVICE_URL || "http://localhost";
    public protocolVersion: string = '2.0';
    public adminEmail: string = process.env.ADMIN_USER_EMAIL;
    public port: number = 0;
    public description: string = "";
    public deletedRecord: string = DELETED_RECORDS_SUPPORT.NO;
    public granularity: string = HARVESTING_GRANULARITY.DATETIME;
    public earliestDatestamp: string = '2017-01-00T03:24:00Z';

}