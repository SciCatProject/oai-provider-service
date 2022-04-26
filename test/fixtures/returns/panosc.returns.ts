export const ListRecords = 
`<oai-pmh xmlns="http://www.openarchives.org/OAI/2.0/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:dc="http://purl.org/dc/elements/1.1/" xsi:schemalocation="http://www.openarchives.org/OAI/2.0/ 
http://www.openarchives.org/OAI/2.0/OAI-PMH.xsd"><request verb="ListRecords" metadataprefix="oai_dc">http://localhost/panosc/oai</request><listrecords><record><header><identifier>ID</identifier><setspec>openaire_data</setspec><datestamp>updatedAt</datestamp></header><metadata><panosc:panosctype xmlns:panosc="http://www.openarchives.org/OAI/2.0/oai_dc/" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemalocation="http://www.openarchives.org/OAI/2.0/oai_dc/ https://raw.githubusercontent.com/panosc-eu/fair-data-api/master/panosc.xsd"><panosc:id>ID</panosc:id><panosc:name>TITLE</panosc:name><panosc:description>DATADESCRIPTION</panosc:description><panosc:owner>CREATOR</panosc:owner><panosc:contactemail></panosc:contactemail><panosc:orcidofowner></panosc:orcidofowner><panosc:license></panosc:license><panosc:embargoenddate></panosc:embargoenddate><panosc:startdate></panosc:startdate><panosc:path></panosc:path><panosc:technique></panosc:technique><panosc:samplename></panosc:samplename><panosc:chemicalformula></panosc:chemicalformula><panosc:size>10</panosc:size><panosc:wavelength></panosc:wavelength></panosc:panosctype></metadata></record></listrecords></oai-pmh>`

export const ListIdentifiers = 
`<oai-pmh xmlns="http://www.openarchives.org/OAI/2.0/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:dc="http://purl.org/dc/elements/1.1/" xsi:schemalocation="http://www.openarchives.org/OAI/2.0/ 
http://www.openarchives.org/OAI/2.0/OAI-PMH.xsd"><request verb="ListIdentifiers" metadataprefix="oai_dc">http://localhost/panosc/oai</request><listidentifiers><record><header><identifier>ID</identifier><datestamp>2021-06-29T16:08:13Z</datestamp></header></record></listidentifiers></oai-pmh>`

export const Identify = 
`<oai-pmh xmlns="http://www.openarchives.org/OAI/2.0/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:dc="http://purl.org/dc/elements/1.1/" xsi:schemalocation="http://www.openarchives.org/OAI/2.0/ 
http://www.openarchives.org/OAI/2.0/OAI-PMH.xsd"><request verb="Identify">http://localhost/panosc/oai</request><identify><repositoryname>Scicat Provider</repositoryname><baseurl>http://localhost/panosc/oai</baseurl><protocolversion>2.0</protocolversion><adminemail>email@email</adminemail><earliestdatestamp>2017-01-00T03:24:00Z</earliestdatestamp><deletedrecord>no</deletedrecord><granularity>YYYY-MM-DDThh:mm:ssZ</granularity></identify></oai-pmh>`

export const GetRecord = 
`<oai-pmh xmlns="http://www.openarchives.org/OAI/2.0/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:dc="http://purl.org/dc/elements/1.1/" xsi:schemalocation="http://www.openarchives.org/OAI/2.0/ 
http://www.openarchives.org/OAI/2.0/OAI-PMH.xsd"><request verb="GetRecord" metadataprefix="oai_dc" identifier="ID">http://localhost/panosc/oai</request><record><header><identifier>ID</identifier><setspec>openaire_data</setspec><datestamp>updatedAt</datestamp></header><metadata><panosc:panosctype xmlns:panosc="http://www.openarchives.org/OAI/2.0/oai_dc/" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemalocation="http://www.openarchives.org/OAI/2.0/oai_dc/ https://raw.githubusercontent.com/panosc-eu/fair-data-api/master/panosc.xsd"><panosc:id>ID</panosc:id><panosc:name>TITLE</panosc:name><panosc:description>DATADESCRIPTION</panosc:description><panosc:owner>CREATOR</panosc:owner><panosc:contactemail></panosc:contactemail><panosc:orcidofowner></panosc:orcidofowner><panosc:license></panosc:license><panosc:embargoenddate></panosc:embargoenddate><panosc:startdate></panosc:startdate><panosc:path></panosc:path><panosc:technique></panosc:technique><panosc:samplename></panosc:samplename><panosc:chemicalformula></panosc:chemicalformula><panosc:size>10</panosc:size><panosc:wavelength></panosc:wavelength></panosc:panosctype></metadata></record></oai-pmh>`

export const panosc = {
    ListRecords: ListRecords,
    ListIdentifiers: ListIdentifiers,
    Identify: Identify,
    GetRecord: GetRecord,
}
