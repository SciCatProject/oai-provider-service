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


## ENVIRONMENT Variables

*System variables**
 Key | Description | Default
 --------:|-------------| --------
APP_ID | Application name used in logging | oai_provider_service
LOG_LEVEL | Level of the logging | debug
VERSION | Version number of the service | _unknown_
ADMIN_USER_EMAIL | E-Mail address of the admin user | _none_
LOG_LEVEL | default/error/warning | error  
PUBLISHED_DATA_ID | field of the published data to be used as id | doi
SCICAT_BACKEND_URL | Full URL of the SciCat Backend Instance to connect to | _none_
SERVICE_URL | URL of the server running the service | http://localhost 
SERVICE_PORT | Port on which the service is listening | 3000
OPENAIRE_ROUTE | route to openaire endpoint used to harvest data using openaire oai-pmh schema | /openaire/oai
SCICAT_ROUTE | route to scicat endpoint used to harvest data using scicat oai-pmh schema | /scicat/oai
PANOSC_ROUTE | route to panosc endpoint used to harvest data using panosc oai-pmh schema | /panosc/oai
SERVICE_NAME | Name assigned by the admins to this specific instance of the service | oai_provider_service
FACILITY_NAME | Name of the facility where this service is running | _unknown_


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





