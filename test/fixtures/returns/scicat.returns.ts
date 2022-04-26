const ListRecords = 
`<oai-pmh xmlns="http://www.openarchives.org/OAI/2.0/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:dc="http://purl.org/dc/elements/1.1/" xsi:schemalocation="http://www.openarchives.org/OAI/2.0/ 
http://www.openarchives.org/OAI/2.0/OAI-PMH.xsd"><request verb="ListRecords" metadataprefix="oai_dc">http://localhost/scicat/oai</request><listrecords><record><header><identifier>ID</identifier><datestamp>2021-01-16T13:46:43Z</datestamp></header><metadata><oai_dc:dc xmlns:oai_dc="http://www.openarchives.org/OAI/2.0/oai_dc/" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemalocation="http://www.openarchives.org/OAI/2.0/oai_dc/ http://www.openarchives.org/OAI/2.0/oai_dc.xsd"><dc:title>TITLE</dc:title><dc:description>DATADESCRIPTION</dc:description><dc:identifier>ID</dc:identifier><dc:identifier>http://localhost/detail/ID</dc:identifier><dc:date>2021</dc:date><dc:creator>CREATOR</dc:creator><dc:type>dataset</dc:type><dc:publisher>PUBLISHER</dc:publisher><dc:rights>Available to the public.</dc:rights></oai_dc:dc></metadata></record></listrecords></oai-pmh>`;

const ListIdentifiers = 
`<oai-pmh xmlns="http://www.openarchives.org/OAI/2.0/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:dc="http://purl.org/dc/elements/1.1/" xsi:schemalocation="http://www.openarchives.org/OAI/2.0/ 
http://www.openarchives.org/OAI/2.0/OAI-PMH.xsd"><request verb="ListIdentifiers" metadataprefix="oai_dc">http://localhost/scicat/oai</request><listidentifiers><record><header><identifier>ID</identifier><datestamp>2021-01-16T13:46:43Z</datestamp></header></record></listidentifiers></oai-pmh>`;

const Identify = 
`<oai-pmh xmlns="http://www.openarchives.org/OAI/2.0/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:dc="http://purl.org/dc/elements/1.1/" xsi:schemalocation="http://www.openarchives.org/OAI/2.0/ 
http://www.openarchives.org/OAI/2.0/OAI-PMH.xsd"><request verb="Identify">http://localhost/scicat/oai</request><identify><repositoryname>Scicat Provider</repositoryname><baseurl>http://localhost/scicat/oai</baseurl><protocolversion>2.0</protocolversion><adminemail>email@email</adminemail><earliestdatestamp>2017-01-00T03:24:00Z</earliestdatestamp><deletedrecord>no</deletedrecord><granularity>YYYY-MM-DDThh:mm:ssZ</granularity></identify></oai-pmh>`;

const GetRecord = 
`<oai-pmh xmlns="http://www.openarchives.org/OAI/2.0/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:dc="http://purl.org/dc/elements/1.1/" xsi:schemalocation="http://www.openarchives.org/OAI/2.0/ 
http://www.openarchives.org/OAI/2.0/OAI-PMH.xsd"><request verb="GetRecord" metadataprefix="oai_dc" identifier="ID">http://localhost/scicat/oai</request><record><header><identifier>ID</identifier><datestamp>2021-01-16T13:46:43Z</datestamp></header><metadata><oai_dc:dc xmlns:oai_dc="http://www.openarchives.org/OAI/2.0/oai_dc/" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemalocation="http://www.openarchives.org/OAI/2.0/oai_dc/ http://www.openarchives.org/OAI/2.0/oai_dc.xsd"><dc:title>TITLE</dc:title><dc:description>DATADESCRIPTION</dc:description><dc:identifier>ID</dc:identifier><dc:identifier>http://localhost/detail/ID</dc:identifier><dc:date>2021</dc:date><dc:creator>CREATOR</dc:creator><dc:type>dataset</dc:type><dc:publisher>PUBLISHER</dc:publisher><dc:rights>Available to the public.</dc:rights></oai_dc:dc></metadata></record></oai-pmh>`;

export const scicat = {
    ListRecords: ListRecords,
    ListIdentifiers: ListIdentifiers,
    Identify: Identify,
    GetRecord: GetRecord,
}