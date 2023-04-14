import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ArtistRoutingModule } from './artist.routing';

import { ListComponent } from './pages/list/list.component';
import { NewComponent } from './pages/new/new.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DetailComponent } from './pages/detail/detail.component';
import { FormComponent } from './components/form/form.component';


@NgModule({
  declarations: [
    ListComponent,
    NewComponent,
    DetailComponent,
    FormComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ArtistRoutingModule
  ]
})
export class ArtistModule { }
