
const ListRecords = 
`<OAI-PMH xmlns="http://www.openarchives.org/OAI/2.0/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:dc="http://purl.org/dc/elements/1.1/" xsi:schemaLocation="http://www.openarchives.org/OAI/2.0/  http://www.openarchives.org/OAI/2.0/OAI-PMH.xsd"><request verb="ListRecords" metadataPrefix="oai_dc">http://localhost/scicat/oai</request><ListRecords><record><header><identifier>ID</identifier></header><metadata><oai_dc:dc xmlns:oai_dc="http://www.openarchives.org/OAI/2.0/oai_dc/" xsi:schemaLocation="http://www.openarchives.org/OAI/2.0/oai_dc/ http://www.openarchives.org/OAI/2.0/oai_dc.xsd"><dc:title>TITLE</dc:title><dc:description>DATADESCRIPTION</dc:description><dc:identifier>ID</dc:identifier><dc:identifier>http://localhost/detail/ID</dc:identifier><dc:date>2021</dc:date><dc:creator>CREATOR</dc:creator><dc:type>dataset</dc:type><dc:publisher>PUBLISHER</dc:publisher><dc:rights>Available to the public.</dc:rights></oai_dc:dc></metadata></record></ListRecords></OAI-PMH>`;

const ListIdentifiers = 
`<OAI-PMH xmlns="http://www.openarchives.org/OAI/2.0/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:dc="http://purl.org/dc/elements/1.1/" xsi:schemaLocation="http://www.openarchives.org/OAI/2.0/  http://www.openarchives.org/OAI/2.0/OAI-PMH.xsd"><request verb="ListIdentifiers" metadataPrefix="oai_dc">http://localhost/scicat/oai</request><ListIdentifiers><record><header><identifier>ID</identifier></header></record></ListIdentifiers></OAI-PMH>`;

const Identify = 
`<OAI-PMH xmlns="http://www.openarchives.org/OAI/2.0/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:dc="http://purl.org/dc/elements/1.1/" xsi:schemaLocation="http://www.openarchives.org/OAI/2.0/  http://www.openarchives.org/OAI/2.0/OAI-PMH.xsd"><request verb="Identify">http://localhost/scicat/oai</request><Identify><repositoryName>Scicat Provider</repositoryName><baseURL>http://localhost/scicat/oai</baseURL><protocolVersion>2.0</protocolVersion><adminEmail>email@email</adminEmail><earliestDatestamp>2017-01-00T03:24:00Z</earliestDatestamp><deletedRecord>no</deletedRecord><granularity>YYYY-MM-DDThh:mm:ssZ</granularity></Identify></OAI-PMH>`;

const GetRecord = 
`<OAI-PMH xmlns="http://www.openarchives.org/OAI/2.0/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:dc="http://purl.org/dc/elements/1.1/" xsi:schemaLocation="http://www.openarchives.org/OAI/2.0/  http://www.openarchives.org/OAI/2.0/OAI-PMH.xsd"><request verb="GetRecord" metadataPrefix="oai_dc" identifier="ID">http://localhost/scicat/oai</request><record><header><identifier>ID</identifier></header><metadata><oai_dc:dc xmlns:oai_dc="http://www.openarchives.org/OAI/2.0/oai_dc/" xsi:schemaLocation="http://www.openarchives.org/OAI/2.0/oai_dc/ http://www.openarchives.org/OAI/2.0/oai_dc.xsd"><dc:title>TITLE</dc:title><dc:description>DATADESCRIPTION</dc:description><dc:identifier>ID</dc:identifier><dc:identifier>http://localhost/detail/ID</dc:identifier><dc:date>2021</dc:date><dc:creator>CREATOR</dc:creator><dc:type>dataset</dc:type><dc:publisher>PUBLISHER</dc:publisher><dc:rights>Available to the public.</dc:rights></oai_dc:dc></metadata></record></OAI-PMH>`;

export const scicat = {
    ListRecords: ListRecords,
    ListIdentifiers: ListIdentifiers,
    Identify: Identify,
    GetRecord: GetRecord,
}
