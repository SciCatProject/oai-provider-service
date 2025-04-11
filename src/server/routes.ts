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

import { Application } from "express";
import { Configuration } from "./configuration"
import * as scicat from "../providers/controllers/scicat";
import * as panosc from "../providers/controllers/panosc";
import * as openaire from "../providers/controllers/openaire";
import logger from "./logger";

export default function routes(app: Application): void {
  logger.debug('Setting express routes for OAI providers.');

  const conf = Configuration.instance;

  app.get('/', (req, res) => {
    const uptime = process.uptime() * 1000;
    return res.send(
      {
        ...conf,
        ...{ 
          "started": new Date(Date.now() - uptime).toISOString().split('.')[0]+"Z", 
          "uptime": +uptime.toFixed(3),
        },
      },
    );
  });
  app.get(conf.scicat_route, scicat.oai);
  app.get(conf.panosc_route, panosc.oai);
  app.get(conf.openaire_route, openaire.oai);
};
