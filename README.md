# OAI-PMH Service

Credit upstream author hatfieldlibrary/oai-provider-service.

OAI-PMH Service is a Nodejs Express application that supports multiple, configurable [OAI-PMH version 2.0](https://www.openarchives.org/OAI/openarchivesprotocol.html) data providers.

OAI-PMH Service borrows from the [Modular OAI-PMH Server](https://github.com/NatLibFi/oai-pmh-server), University of Helsinki, 
The National Library of Finland. 
 

## Dependenices

* Node 8.9.4+
* Typescript 2.7.2+
* npm 5.6.0+

## Capabilities

Supports `Identify`, `ListMetadataFormats`, `GetRecord`, `ListIdentifiers` and `ListRecords`. The optional
`from` and `until` arguments are supported for selective harvesting with `YYYY-MM-DDThh:mm:ssZ` granularity.  `ListSets` is not supported.  

## Install It
```
npm install
```

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

Add new records to your mongodb instance by HTTP PUT using the folling route:

* [`http://localhost:3000/scicat/Publication`](http://localhost:3000/scicat/Publication)


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





