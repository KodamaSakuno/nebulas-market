import { NgModule } from '@angular/core';

import { FeatherModule } from 'angular-feather';
import { Plus, Minus } from 'angular-feather/icons';

const icons = {
  Plus,
  Minus,
};

@NgModule({
  imports: [FeatherModule.pick(icons)],
  exports: [FeatherModule],
})
export class AppIconsModule { }
