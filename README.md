# OAI-PMH Service

[![Build Status](https://github.com/SciCatProject/oai-provider-service/actions/workflows/ci.yml/badge.svg?branch=master)](https://github.com/SciCatProject/oai-provider-service/actions)
[![DeepScan grade](https://deepscan.io/api/teams/8394/projects/10552/branches/148053/badge/grade.svg)](https://deepscan.io/dashboard#view=project&tid=8394&pid=10552&bid=148053)
[![Known Vulnerabilities](https://snyk.io/test/github/SciCatProject/oai-provider-service/master/badge.svg?targetFile=package.json)](https://snyk.io/test/github/SciCatProject/oai-provider-service/master?targetFile=package.json)

Credit upstream author hatfieldlibrary/oai-provider-service.

OAI-PMH Service is a Nodejs Express application that supports multiple, configurable [OAI-PMH version 2.0](https://www.openarchives.org/OAI/openarchivesprotocol.html) data providers.

OAI-PMH Service borrows from the [Modular OAI-PMH Server](https://github.com/NatLibFi/oai-pmh-server), University of Helsinki, 
The National Library of Finland. 
 

## Dependenices

* Node v18.20.38+
* Typescript 5.5.3+
* npm 10.8.1+
* tsx v4.16.2 (for mocha tests only)

## Capabilities

Supports `Identify`, `ListMetadataFormats`, `GetRecord`, `ListIdentifiers` and `ListRecords`. The optional
`from` and `until` arguments are supported for selective harvesting with `YYYY-MM-DDThh:mm:ssZ` granularity.  `ListSets` is not supported.  

## Install It
```
npm install
```

## Configure It

The service uses dotenv to import variables into the environment and from the top level .env file (in the production dir), a variable HOST_CONFIGURATION is defined which points to a JSON file, defining port and host for the service itself. If multiple providers are desired, then the definition of HOST_CONFIGURATION should be moved to the provider level. At this time, we do not require multiple providers.

## Run It
#### Run in *development* mode:

```
npm run dev
```

#### Routes:

The Express server will start on default port 3000.  

* [`http://localhost:3000/scicat/oai?verb=Identify`](http://localhost:3000/scicat/oai?verb=Identify)
* [`http://localhost:3000/scicat/oai?verb=ListMetadataFormats`](http://localhost:3000/scicat/oai?verb=ListMetadataFormats)
* [`http://localhost:3000/scicat/oai?verb=GetRecord&identifier=1&metadataPrefix=oai_dc`](http://localhost:3000/scicat/oai?verb=GetRecord&identifier=1&metadataPrefix=oai_dc)
* [`http://localhost:3000/scicat/oai?verb=ListIdentifiers&metadataPrefix=oai_dc`](http://localhost:3000/scicat/oai?verb=ListIdentifiers&metadataPrefix=oai_dc)
* [`http://localhost:3000/scicat/oai?verb=ListRecords&metadataPrefix=oai_dc`](http://localhost:3000/scicat/oai?verb=ListRecords&metadataPrefix=oai_dc)

### PUT Records:

Add new records to your mongodb instance by HTTP PUT using the following route:

* `http://localhost:3000/scicat/Publication`


## ENVIRONMENT Variables

*System variables**
 Key | Description | Default
 --------:|-------------| --------
DAPP_ID | No Idea | oai-pmh-service
CONNECTOR | (don't change) | mongodb
ADMIN_USER_EMAIL | E-Mail address of the admin user | none
LOG_LEVEL | default/error/warning | error  

**Mongo DB variables**
 Key | Description | Default
 --------:|-------------| --------
CONNECTOR | (don't change) | mongodb
DB_HOST | Database Hostname | none
DB_PORT | Database Port | none
DB_USER | Database Username | none
DB_PASS | Database Password | none
DB_URL |  [&lt;user&gt;:&lt;password&gt;@]&lt;host&gt;:&lt;port&gt;/&lt;dbName&gt;| none
DATABASE | Publication Database | dacat-next
COLLECTION | Collection to storage Publation Documents| PublishedData
COLLECTION_ID | Unique Identifier of records | 'doi' 
BASE_URL | Prefix to link back to this server | http://localhost 

**Note**: When DB_URL is specified, DB_HOST/DB_PORT/DB_USER/DB_PASS and DATABASE are ignored.

**OAI_PMH Listen Port**

 Key | Description | Default
 --------:|-------------| --------
HOST_CONFIGURATION | web server configuration | production/host_config.json

The content of the *host_config.json* file are the json encoded variables to steer the web server itself. 
As far as I can see, the 'host' variable is ignored in the code, but the 'port' variable is honored.

**Example** for a *host_config.json* file.
```
{
   "host": "localhost",
    "port": 3000
}
```

### Docker start example
Docker start example, assuming there is a network called
'scicatlive_default'.
```
docker run \
   --network=scicatlive_default  \
   -e CONNECTOR=mongodb \
   -e DB_HOST=mongodb \
   -e DB_PORT=27017   \
   -e DB_USER=""      \
   -e DB_PASSWORD=""  \
   -e DATABASE=dacat-next \
   -e COLLECTION=PublishedData \
   -e COLLECTION_ID="_id" \
   -e HOST_CONFIG=server/host_config.json \
   -p 7002:3001 \
   --name=oai-pmh-provider \
   oai-pmh-provider
```

## Run in *production* mode:

At the simplest level:
```
npm run compile
npm start
```

The gulp tasks compile Typescript and copy files to `dist`. 

The project can be deployed to a production server and started with `node index` from within `dist`. Runtime configurations
can be adjusted using `.env` and (recommended) external configuration files created for your environment. We typically run as server daemon using [forever](https://github.com/foreverjs/forever), or some tool 
to assure that the server runs continuously.  





