import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { TimelineModule } from './timeline/timeline.module';
import { TracksService } from './services';

/*
* Корневой модуль
* */

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    TimelineModule,
  ],
  providers: [
    TracksService,
  ],
  bootstrap: [
    AppComponent,
  ],
})
export class AppModule { }
