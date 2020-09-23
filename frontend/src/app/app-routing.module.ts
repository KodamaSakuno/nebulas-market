import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConfigComponent } from './pages/config/config.component';
import { MainComponent } from './pages/main/main.component';
import { TxsComponent } from './pages/txs/txs.component';

const routes: Routes = [
  { path: 'config', component: ConfigComponent },
  { path: 'txs', component: TxsComponent },

  { path: '**', component: MainComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
