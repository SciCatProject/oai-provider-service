import logger from "../../../server/logger";
import {ProviderDCMapper} from "../../core/core-oai-provider";

export class ScicatPanoscMapper implements ProviderDCMapper {

    /**
     * The Universal Coordinated Time (UTC) date needs to be modifed
     * to match the local timezone.
     * @param record the raw data returned by the mongo dao query
     * @returns {string}
     */
    private setTimeZoneOffset(record: any): string {
        const date = new Date(record.updatedAt);
        const timeZoneCorrection = new Date(date.getTime() + date.getTimezoneOffset() * -60000);
        return timeZoneCorrection.toISOString().split('.')[0] + "Z";

    }

    private getRightsMessage(restricted: boolean): string {
        if (restricted) {
            return "Restricted to University users."
        }
        return "Available to the public."
    }

    private createItemRecord(record: any): any {

        //const updatedAt: string = this.setTimeZoneOffset(record);
        let item =
            {
                record: [
                    {
                        'header': [
                            {'identifier': record._id.toString()},
                            {'datestamp': "updatedAt"}
                        ]
                    },
                    {
                        'metadata': [
                            {
                                'panosc:panosctype': [{
                                    '_attr':
                                        {
                                            'xmlns:panosc': 'http://www.openarchives.org/OAI/2.0/oai_dc/',
                                            'xmlns:dc': 'http://purl.org/dc/elements/1.1/',
                                            'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
                                            'xsi:schemaLocation': 'http://www.openarchives.org/OAI/2.0/oai_dc/ ' +
                                            'https://raw.githubusercontent.com/panosc-eu/fair-data-api/master/panosc.xsd'
                                        }
                                },
                                    {'panosc:id': record.doi},
                                    {'panosc:name': record.title},
                                    {'panosc:description':  record.dataDescription},
                                    {'panosc:owner': record.creator},
                                    {'panosc:contactEmail': record.contactEmail},
                                    {'panosc:orcidOfOwner': record.orcidOfOwner},
                                    {'panosc:license': record.license},
                                    {'panosc:embargoEndDate': record.embargoEndDate},
                                    {'panosc:startDate': record.startDate},
                                    {'panosc:path': record.path},
                                    {'panosc:technique': record.technique},
                                    {'panosc:sampleName': record.sampleName},
                                    {'panosc:chemicalFormula': record.chemicalFormula},
                                    {'panosc:size': record.sizeOfArchive},
                                    {'panosc:wavelength': record.wavelength}]
                            }]
                    }]
            };
        return item;
    }

    public mapOaiDcListRecords(records: any[]): any {

        const list = [];
        const response = {
            ListRecords: <any>[]
        };

        for (let record of records) {
            let item = this.createItemRecord(record);
            list.push(item);
        }

        logger.debug('Parsed ' + list.length + " records into panosc xml format.");

        response.ListRecords = list;

        return response;

    }

    public mapOaiDcGetRecord(record: any): any {
        if (!record) {
            throw new Error("Record not found");
        }

        let item = this.createItemRecord(record);
        logger.debug('Got item with id ' + record._id + ", title: " + record.title);
        return item;

    }

    public mapOaiDcListIdentifiers(records: any[]): any {

        const list = [];
        const response = {
            ListIdentifiers: <any>[]
        };

        for (let record of records) {
            const updatedAt: string = this.setTimeZoneOffset(record);
            let item =
                {
                    record: [
                        {
                            'header': [
                                {'identifier': record.id.toString()},
                                {'datestamp': updatedAt}
                            ]
                        }
                    ]
                };

            list.push(item);
        }

        response.ListIdentifiers = list;

        return response;

    }

}
