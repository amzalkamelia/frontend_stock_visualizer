import { Routes } from '@angular/router';
import {StockDisplayComponent} from "./stock-display/stock-display.component";

export const routes: Routes = [
  { path: '', redirectTo: 'getStock', pathMatch: 'full' },
  { path: 'getStock', component: StockDisplayComponent}

];
