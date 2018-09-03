import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { TracksService } from '../services';
import { Track } from '../model';
import {generateId} from '../lib';

/*
* Компонент таймлайна треков
* */

@Component({
  selector: 'my-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent implements OnInit {

  @ViewChild('timelineContentColTimeline') timelineContentColTimeline: ElementRef;

  @HostListener('window:resize') windowResize() {
    this.calculateTimelineSize();
  }

  public tracks: Track[] = [];
  readonly hours: number[] = Array(24).fill(0).map((x,i)=>i);
  private timelineContentWidth: number;

  constructor(
    private tracksService: TracksService,
  ) { }

  ngOnInit() {
    this.getTracks();
  }

  ngAfterContentInit() {
    this.calculateTimelineSize();
  }

  // Получить список треков
  private getTracks(): void {
    this.tracksService
      .get()
      .subscribe((tracks: Track[]) => {
        this.tracks = tracks.map((track: Track):Track => {
          if ( this.timelineContentWidth ) {
            track.calculateSizePx(this.timelineContentWidth);
          }
          return track;
        });
      });
  }

  // Пересчет размеров элементов в таймлайне
  private calculateTimelineSize() {
    this.timelineContentWidth = this.timelineContentColTimeline.nativeElement.offsetWidth;
    this.tracks.map((track: Track): Track => {
      track.calculateSizePx(this.timelineContentWidth);
      return track;
    });
  }

  // Выбор файла
  public onFileInputChange(event: any): void {
    const trackName = event.target.files[0].name;
    const track = new Track(
      trackName,
      0,
      0,
      60
    );

    this.tracksService
      .create(track)
      .subscribe(() => {
        this.getTracks();
      });
  }
}
