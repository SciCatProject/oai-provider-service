import logger from "../../../server/logger";
import {ProviderDCMapper} from "../../core/core-oai-provider";

export class ScicatDcMapper extends ProviderDCMapper {

  route = process.env.SCICAT_ROUTE || "/scicat/oai";

  /**
   * The Universal Coordinated Time (UTC) date needs to be modifed
   * to match the local timezone.
   * @param record the raw data returned by the mongo dao query
   * @returns {string}
   */
  private setTimeZoneOffset(record: any): string {
      const date = new Date(record?.registeredTime?.$date ?? Date.now());
      const timeZoneCorrection = new Date(date.getTime() + date.getTimezoneOffset() * -60000);
      timeZoneCorrection.setMilliseconds(0);
      return timeZoneCorrection.toISOString().split('.')[0] + "Z";

  }

  private getRightsMessage(restricted: boolean): string {
      if (restricted) {
          return "Restricted to University users."
      }
      return "Available to the public."
  }

  private createItemRecord(record: any): any {

      const updatedAt: string = this.setTimeZoneOffset(record);
      let item =
          {
              record: [
                  {
                      'header': [
                          {'identifier': record[this.collection_id]},
                          {'datestamp': updatedAt}
                      ]
                  },
                  {
                      'metadata': [
                          {
                              'oai_dc:dc': [{
                                  '_attr':
                                      {
                                          'xmlns:oai_dc': 'http://www.openarchives.org/OAI/2.0/oai_dc/',
                                          'xmlns:dc': 'http://purl.org/dc/elements/1.1/',
                                          'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
                                          'xsi:schemaLocation': 'http://www.openarchives.org/OAI/2.0/oai_dc/ ' +
                                          'http://www.openarchives.org/OAI/2.0/oai_dc.xsd'
                                      }
                              },
                                  {'dc:title': record.title},
                                  {'dc:description':  record.dataDescription},
                                  {'dc:identifier': record[this.collection_id]},
                                  {'dc:identifier': process.env.BASE_URL + 
                                  "/detail/" + encodeURIComponent(record[this.collection_id])},
                                  {'dc:date': record.publicationYear},
                                  {'dc:creator': record.creator},
                                  {'dc:type': "dataset"},
                                  {'dc:publisher': record.publisher},
                                  {'dc:rights': this.getRightsMessage(false)},
                                  ],
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

    logger.debug("Parsed " + list.length + " records into OAI xml format.");

    response.ListRecords = list;

    return response;
  }

  public mapOaiDcGetRecord(record: any): any {
    if (!record) {
      throw new Error("Record not found");
    }

    let item = this.createItemRecord(record);
    logger.debug("Got item with id " + record[this.collection_id] + ", title: " + record.title);
    return item;
  }

  public mapOaiDcListIdentifiers(records: any[]): any {
    const list = [];
    const response = {
      ListIdentifiers: <any>[]
    };

    for (let record of records) {
      const updatedAt: string = this.setTimeZoneOffset(record);
      let item = {
        record: [
          {
            header: [
              { identifier: record[this.collection_id].toString() },
              { datestamp: updatedAt }
            ]
          }
        ]
      };

      list.push(item);
    }

    response.ListIdentifiers = list;

    return response;
  }

  public mapOaiDcListSets(records: any[]): any {
    const response = {
      ListSets: <any>[]
    };
    const list = [];
    let item = {
      set: [{ setName: "openaire_data" }, { setSpec: "openaire_data" }]
    };
    list.push(item);
    response.ListSets = list;
    return response;
  }
}
