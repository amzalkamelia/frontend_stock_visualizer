import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HttpClient} from "@angular/common/http";
import {DataPoint} from "../model/DataPoint";
import {Observable} from "rxjs";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Router, RouterLink} from "@angular/router";
import {StockRequest} from "../model/StockRequest";
import {SendStockRequestService} from "../service/send-stock-request.service";
import {StockRecordMetaData} from "../model/StockRecordMetaData";

@Component({
  selector: 'app-stock-display',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './stock-display.component.html',
  styleUrl: './stock-display.component.css'
})
export class StockDisplayComponent {
  private readonly URL_STOCK = 'https://projet-web-java-miage-psl.azurewebsites.net';
  DataPointList: DataPoint[] | undefined;

  stock_key = 'IBM';
  date_from = '2024-01-08';
  date_to = '2024-01-12';
  recordMetaData: StockRecordMetaData | undefined;
  top5Stocks: Map<string, number> | any;

  form: FormGroup = new FormGroup({});
  submitted = false;
  StockRequest: StockRequest | any;


  constructor(
    private readonly httpClient: HttpClient,
    private router: Router,
    private readonly sendStockRequestService: SendStockRequestService
  ) {
  }

  ngOnInit(): void {
    this.sendStockRequestService.fetchTop5WeeklyStocks()
      .subscribe(value => {
      this.top5Stocks = value;
    });
    console.log(this.top5Stocks?.get("IBM"));
    this.loadForm();
    console.log("stock-display ngOnInit")
    this.getDefaultDataPoints()
      .pipe()
      .subscribe(value => {
        this.DataPointList = value;
      });
    this.getDefaultRecordMetaData()
      .pipe()
      .subscribe(value => {
        this.recordMetaData = value;
      });
  }

  onSubmit(): void {
    this.submitted = true;
    this.StockRequest = this.form.value.StockRequest;
    if (this.form.valid) {
      this.submitted = true;
      this.StockRequest = this.form.value;
      // if only date_from is provided, then date_target = date_from and send a single day request
      if (this.StockRequest.date_from && !this.StockRequest.date_to) {
        this.StockRequest.date_target = this.StockRequest.date_from;
      }
      // if date_from and date_to are provided, then send a day range request
      else if (this.StockRequest.date_from && this.StockRequest.date_to && this.StockRequest.date_from != this.StockRequest.date_to) {
        // do nothing
      }
      // else: error
      else {
        console.error("Error: invalid stock request:");
        console.error(this.StockRequest);
      }
    } else {
      this.submitted = false;
      return;
    }

    // fetch stock data
    this.sendStockRequestService.fetchStockData(this.StockRequest)
      ?.pipe().subscribe(value => {
      this.DataPointList = value;
    });
    // fetch stock record meta data
    this.sendStockRequestService.fetchRecordMetaData(this.StockRequest.stock_key)
      ?.pipe().subscribe(value => {
      this.recordMetaData = value;
    });
    // update properties
    this.stock_key = this.form.value.stock_key;
    this.date_from = this.form.value.date_from;
    this.date_to = this.form.value.date_to;

    // re-render the page without reloading
    this.router.navigateByUrl('/getStock', {skipLocationChange: true}).then(() => {
      this.router.navigate(['/getStock']);
    });



  }

  loadForm(): void {
    this.form = new FormGroup({
      stock_key: new FormControl('', Validators.required),
      // should enter a date in the format YYYY-MM-DD, and only the first field is required
      date_from: new FormControl('', [Validators.pattern('^[0-9]{4}-(?:0[1-9]|1[0-2])-[0-2][0-9]$',), Validators.required]),
      date_to: new FormControl('', Validators.pattern('^[0-9]{4}-(?:0[1-9]|1[0-2])-[0-2][0-9]$')),
    });
  }

  get stockRequestForm() {
    return this.form.controls;
  }

  getDefaultDataPoints(): Observable<DataPoint[]> {
    const url = `${this.URL_STOCK}/stock_data/day_range?stock_key=${this.stock_key}&date_from=${this.date_from}&date_to=${this.date_to}`;
    return this.httpClient.get<DataPoint[]>(url);
  }

  private getDefaultRecordMetaData() {
    return this.httpClient.get<StockRecordMetaData>(this.URL_STOCK + "/record_requests/" + this.stock_key);
  }
}
