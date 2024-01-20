export class StockRecordMetaData {
  constructor(
    public id: number,
    public stockKey: string,
    public updatedDate: string,
    public todayConsultedCount: number,
    public weeklyConsultedCount: number,
    public totalConsultedCount: number
  ) {
    this.id = id;
    this.stockKey = stockKey;
    this.updatedDate = updatedDate;
    this.todayConsultedCount = todayConsultedCount;
    this.weeklyConsultedCount = weeklyConsultedCount;
    this.totalConsultedCount = totalConsultedCount;
  }
}
