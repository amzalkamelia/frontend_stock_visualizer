import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {StockRequest} from "../model/StockRequest";
import {DataPoint} from "../model/DataPoint";
import {StockRecordMetaData} from "../model/StockRecordMetaData";

@Injectable({
  providedIn: 'root'
})

export class SendStockRequestService {
  private readonly APPLICATION_JSON = 'application/json';
  private readonly baseURL = 'https://projet-web-java-miage-psl.azurewebsites.net';
  private readonly singleDayURL = `${this.baseURL}/stock_data/single_day`;
  private readonly dayRangeURL = `${this.baseURL}/stock_data/day_range`;
  private readonly top5URL = `${this.baseURL}/record_requests/top5/week`;
  private readonly recordMetaDataURL = `${this.baseURL}/record_requests`;

  private readonly option = {
    headers: this.httpHeaders
  };
  constructor(private http: HttpClient) {}
  public fetchStockData(stockRequest: StockRequest) {

    if (!stockRequest) {
      console.error("Error: stock request is"+stockRequest);
      return null;
    }

    const headers = { 'content-type': 'application/json'};
    let url: string;
    // if only date_from is provided, then date_target = date_from and send a single day request
    if (stockRequest.date_from && !stockRequest.date_to) {
      stockRequest.date_target = stockRequest.date_from;
      url = `${this.singleDayURL}?stock_key=${stockRequest.stock_key}&date_target=${stockRequest.date_target}`;
    }
    // if date_from and date_to are provided, then send a day range request
    else if (stockRequest.date_from && stockRequest.date_to) {
      url = `${this.dayRangeURL}?stock_key=${stockRequest.stock_key}&date_from=${stockRequest.date_from}&date_to=${stockRequest.date_to}`;
    }
    // else: error

    else {
      console.error("Error: invalid stock request:");
      console.error(stockRequest);
      return null;
    }
    return this.http.get<DataPoint[]>(url, this.option);
  }

  public fetchRecordMetaData(stock_key: string) {
    return this.http.get<StockRecordMetaData>(this.recordMetaDataURL+"/"+stock_key, this.option);
  }

  public fetchTop5WeeklyStocks()  {
    return this.http.get<Map<string, number>>(this.top5URL, this.option);
  }

  private get httpHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': this.APPLICATION_JSON,
      'Accept': this.APPLICATION_JSON,
      'Access-Control-Allow-Origin': "*"
    });
  }



}
