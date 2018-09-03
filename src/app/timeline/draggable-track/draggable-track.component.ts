import { Component, HostListener, Input, OnInit } from '@angular/core';
import { Track } from '../../model';

/*
* Компонент перемещаемого трека в таймлайне
* */

@Component({
  selector: 'my-draggable-track',
  templateUrl: './draggable-track.component.html',
  styleUrls: ['./draggable-track.component.scss']
})
export class DraggableTrackComponent implements OnInit {

  @Input() track: Track;

  // Перемещение мыши
  @HostListener('document:mousemove', ['$event']) onMouseMove(event: MouseEvent): void {
    if ( !this.track.isMoveing ) {
      return;
    }

    const offsetClientX = event.clientX - this.startClientX; // На сколько переместился курсор относительно начального положения

    switch ( this.activeSide ) {
      case 'center':
        this.track.move(offsetClientX);
        break;

      case 'left':
        this.track.moveLeft(offsetClientX);
        break;

      case 'right':
        this.track.moveRight(offsetClientX);
        break;
    }
  }

  // Покидание мышью документа
  @HostListener('document:mouseleave') onMouseLeave(): void {
    this.track.stopMoveing();
  }

  // Поднятие кнопки мыши
  @HostListener('document:mouseup') onMouseUp(): void {
    this.track.stopMoveing();
  }

  private activeSide: 'left'|'center'|'right'; // Что перемещается левая граница, правая, или трек целиком
  private startClientX: number; // Координата мыши по горизонтали на начало перетаскивания

  constructor() { }

  ngOnInit() { }

  // Опустилась кнопка мыши
  public onMouseDown(event: MouseEvent, targetName: 'left'|'center'|'right'): void {
    this.activeSide = targetName;
    this.startClientX = event.clientX;
    this.track.startMoveing();
  }

}
