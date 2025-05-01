# OAI-PMH Service for SciCat

Credit upstream author hatfieldlibrary/oai-provider-service.

OAI-PMH Service for SciCat is a Nodejs application that allows SciCat instances to distribute Published Data records through the OAI-PMH protocol and be harvested by data collectors through this protocol.

OAI-PMH Service borrows from the [Modular OAI-PMH Server](https://github.com/NatLibFi/oai-pmh-server), University of Helsinki, 
The National Library of Finland. 
 

## Dependenices

* Node v20+
* Typescript 5.5.3+
* npm 10.9+
* tsx v4.16.2 (for mocha tests only)

## Capabilities

Supports `Identify`, `ListMetadataFormats`, `GetRecord`, `ListIdentifiers` and `ListRecords`. The optional
`from` and `until` arguments are supported for selective harvesting with `YYYY-MM-DDThh:mm:ssZ` granularity.  `ListSets` is not supported.  

## Installation
### From source code
Clone this repository
```
git clone https://github.com/SciCatProject/oai-provider-service.git
cd oai-provider-service
```
Install all the needed node modules
```
npm install
```
Configure your instance with a `.env` file. Please see below for more information about available options.  
  
Run the application locally
```
npm run clean.start.env
```

### From local docker container
Clone this repository
```
git clone https://github.com/SciCatProject/oai-provider-service.git
cd oai-provider-service
```
Create local docker image
```
docker build -t "scicatproject/oai-provider-service:local" .
```
If needed, change your copy of the file `nev.docker.testing`.  
  
Run the application from the docker container
```
docker run --env-file .env.docker.testing -p 3000:3000 scicatproject/oai-provider-service
```
On the terminal window, you should see the following output:
```
{"level":20,"time":1746090432790,"pid":18,"hostname":"xxxxxx","name":"oai_provider_service","msg":"Creating the OAI data provider for: Scicat Provider"}
{"level":20,"time":1746090432791,"pid":18,"hostname":"xxxxxx","name":"oai_provider_service","msg":"Setting up scicat client."}
{"level":30,"time":1746090432791,"pid":18,"hostname":"xxxxxx","name":"oai_provider_service","msg":"SciCat url: https://my.scicat.instance"}
{"level":20,"time":1746090432792,"pid":18,"hostname":"xxxxxx","name":"oai_provider_service","msg":"Creating the OAI data provider for: Scicat Provider"}
{"level":20,"time":1746090432793,"pid":18,"hostname":"xxxxxx","name":"oai_provider_service","msg":"Creating the OAI data provider for: Scicat Provider"}
{"level":20,"time":1746090432795,"pid":18,"hostname":"xxxxxx","name":"oai_provider_service","msg":"Setting express routes for OAI providers."}
{"level":30,"time":1746090432795,"pid":18,"hostname":"xxxxxx","name":"oai_provider_service","msg":"Up and running in local testing @: http://localhost on port: 3000"}
```
If you see the following output, the container cannot connect to the SciCat BE instance that you want to use.  
Please verify that the URL that you provided in configuration is correct.
```
> cd dist && node index.js
...
{"level":50,"time":1746090432891,"pid":18,"hostname":"xxxxxx","name":"oai_provider_service","msg":"Failed to connect to SciCat"}
{"level":50,"time":1746090432891,"pid":18,"hostname":"xxxxxx","name":"oai_provider_service","msg":"The request failed and the interceptors did not return an alternative response"}
/home/node/app/node_modules/@scicatproject/scicat-sdk-ts-fetch/dist/runtime.js:110
                        throw new FetchError(e, 'The request failed and the interceptors did not return an alternative response');
                              ^

FetchError: The request failed and the interceptors did not return an alternative response
    at PublishedDataApi.<anonymous> (/home/node/app/node_modules/@scicatproject/scicat-sdk-ts-fetch/dist/runtime.js:110:31)
    at Generator.throw (<anonymous>)
    at rejected (/home/node/app/node_modules/@scicatproject/scicat-sdk-ts-fetch/dist/runtime.js:19:65)
    at process.processTicksAndRejections (node:internal/process/task_queues:95:5) {
  cause: TypeError: fetch failed
      at node:internal/deps/undici/undici:13510:13
      at process.processTicksAndRejections (node:internal/process/task_queues:95:5) {
    [cause]: Error: getaddrinfo ENOTFOUND my.scicat.instance
        at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:120:26) {
      errno: -3008,
      code: 'ENOTFOUND',
      syscall: 'getaddrinfo',
      hostname: 'my.scicat.instance'
    }
  }
}

Node.js v20.19.1
```

Point your browser to url `http://localhost:3000`.
You should see the following information:
```
{
   "environment":"local testing",
   "app_id":"oai_provider_service",
   "log_level":"debug",
   "version":"dev",
   "admin_user_email":"docker.testing@oai-pmh.scicatproject.org","published_data_id":"doi",
   "scicat_backend_url":"https://xxxxxxxx",
   "service_url":"http://localhost",
   "service_port":3000,
   "openaire_route":"/openaire/oai",
   "scicat_route":"/scicat/oai",
   "panosc_route":"/panosc/oai","service_name":"oai_provider_docker_testing",
   "facility_name":"Local Docker Testing",
   "started":"2025-05-01T09:15:31Z",
   "uptime":12004.478
}
```

## Routes

The service will start on default port 3000.
It implements the following three endpoints which provides slightly different mapping of the XML provided:
* scicat/oai
* openaire/oai
* panosc/oai

For each one of the endpoint, the folliwing verbs are implemented:
* Identify: 
[`http://localhost:3000/openaire/oai?verb=Identify`](http://localhost:3000/openaire/oai?verb=Identify)
* ListMetadataFormats: [`http://localhost:3000/openaire/oai?verb=ListMetadataFormats`](http://localhost:3000/openaire/oai?verb=ListMetadataFormats)
* GetRecord: [`http://localhost:3000/openaire/oai?verb=GetRecord&identifier=1&metadataPrefix=oai_dc`](http://localhost:3000/openaire/oai?verb=GetRecord&identifier=1&metadataPrefix=oai_dc)
* ListIdentifiers: [`http://localhost:3000/openaire/oai?verb=ListIdentifiers&metadataPrefix=oai`](http://localhost:3000/openaire/oai?verb=ListIdentifiers&metadataPrefix=oai)
* ListRecords: [`http://localhost:3000/openaire/oai?verb=ListRecords&metadataPrefix=oai`](http://localhost:3000/openaire/oai?verb=ListRecords&metadataPrefix=oai)

## Configuration

The service uses dotenv to import variables into the environment. You can configure an .env file in the top level folder, which will be properly copied to be used when running.
You could also define environment variable in your terminal or in the docker container if you are running in containerized infrastructure.

## ENVIRONMENT Variables

Key | Description | Default
--------:|-------------| --------
ENVIRONMENT | String identifing the environment we are running in | local testing
APP_ID | Application name used in logging | oai_provider_service
LOG_LEVEL | Level of the logging | debug
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






