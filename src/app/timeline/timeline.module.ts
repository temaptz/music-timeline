import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { TimelineComponent } from './timeline.component';
import { DraggableTrackComponent } from './draggable-track/draggable-track.component';

/*
* Модуль таймлайна треков
* */

@NgModule({
  declarations: [
    TimelineComponent,
    DraggableTrackComponent
  ],
  imports: [
    BrowserModule,
  ],
  providers: [],
  bootstrap: [
    TimelineComponent,
  ],
  exports: [
    TimelineComponent,
  ],
})
export class TimelineModule { }
