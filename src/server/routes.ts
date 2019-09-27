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
import * as scicat from "../providers/controllers/scicat";
import * as panosc from "../providers/controllers/panosc";
import logger from "./logger";
import * as auth from "http-auth";

export default function routes(app: Application): void {
  logger.debug("Setting express routes for OAI providers.");
  // routes that do not require auth
  app.get("/scicat/oai", scicat.oai);
  app.get("/scicat/Publication/:id", scicat.findPublication);
  // curl -X GET --header 'Accept: application/json' 
  //    'http://localhost:3001/scicat/Publication?limits=(limit:30,skip:0)'
  app.get("/scicat/Publication/:limits?", scicat.getPublication);
  app.get("/panosc/oai", panosc.oai);

  // const passwd = process.env.passwd;
  // var basic = auth.basic({realm:"MyRealm", file:"/srv/config/passwd"});
  /*var basic = auth.basic(
    {
      realm: "localhost"
    },
    (username, password, callback) => {
      console.log("----------username", username, password)
      // Custom authentication
      // Use callback(error) if you want to throw async error.
      callback(username === "Tina" && password === "Bullock");
    }
  );
  app.use(auth.connect(basic));*/
  // routes that require basic auth
  app.put("/scicat/oai/Publication", scicat.putPublication);
}
