# Required variables
**Source**
- Environment Variables
   - .env on src/server
   - from OS
   - from docker -e KEY=Value options
   - from docker-compose 'environment' section
- .env file is copied from production/.env to
  src/server/.env on installation and from 
  there picked up by the production system.

**System variables**
 Key | Description | Default
 --------:|-------------| --------
DAPP_ID | No Idea | oai-pmh-service
CONNECTOR | (don't change) | mongodb
ADMIN_USER_EMAIL | E-Mail address of the admin user | none
LOG_LEVEL | default/error/warning | none  

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
