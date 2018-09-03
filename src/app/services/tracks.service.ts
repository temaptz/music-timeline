import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Track } from '../model';
import { TracksMock } from '../mock';

/*
* Сервис работы с треками
* */

@Injectable()
export class TracksService {

  private tracks: Track[] = TracksMock;

  constructor() { }

  // Получить список треков
  public get(): Observable<Track[]> {
    return of(this.tracks);
  }

  // Добавить трек
  public create(track: Track): Observable<Track> {
    this.tracks.push(track);
    return of(track);
  }

}
