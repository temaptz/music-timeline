import {generateColor, generateId} from '../lib';

export class Track {

  /*
  * Сущность трека
  * */

  constructor(
    public name: string,
    public startHour: number, // Час начала
    public startMinute: number, // Минута начала
    public durationMinute: number, // Продолжительность в минутах
  ) {
    this.name = name;
    this.startHour = startHour;
    this.startMinute = startMinute;
    this.durationMinute = durationMinute;
  }

  public id: number = generateId();
  public color: string = generateColor();
  public isMoveing = false; // Происходит ли сейчас перемещение или растягивание трека

  public offsetLeftPx?: number; // Отступ слева в пикселях
  public widthPx?: number; // Ширина в пикселях
  private offsetLeftPxBeforeMoveing?: number; // Отступ слева до начала перетаскивания
  private widthPxBeforeMoveing?: number; // Ширина до начала перетаскивания
  private timelineWidthPx?: number; // Ширина таймлайна в пикселях по которому можно таскать трек
  private timelineLengthMinutes = 60 * 24 // Общая продолжительность таймлайна в минутах;

  public dateFrom?: Date; // Дата начала воспроизведения
  public dateTo?: Date; // Дата окончания воспроизведения


  // Посчитать размеры трека в пикселях в зависимости от размера контейнера
  public calculateSizePx(containerWidthPx: number): void {
    this.timelineWidthPx = containerWidthPx;
    this.widthPx = this.durationMinute * this.timelineWidthPx / ( 60 * 24 );
    this.offsetLeftPx = ( this.startHour * 60 + this.startMinute ) * this.timelineWidthPx / ( 60 * 24 );

    this.reCalculateDateFromTo();
  }

  // Начать перетаскивание трека по таймлайну
  public startMoveing(): void {
    this.isMoveing = true;
    this.offsetLeftPxBeforeMoveing = this.offsetLeftPx;
    this.widthPxBeforeMoveing = this.widthPx;
  }

  // Переместить трек целиком по таймлайну
  public move(offset: number): void {
    const newOffsetLeftPx = this.offsetLeftPxBeforeMoveing + offset;
    const newOffsetRightPx = this.getOffsetRightPx(newOffsetLeftPx);
    if ( newOffsetLeftPx >= 0 && newOffsetRightPx >= 0 ) {
      this.offsetLeftPx = newOffsetLeftPx;
    } else if ( newOffsetLeftPx < 0 ) {
      this.offsetLeftPx = 0;
    } else if ( newOffsetRightPx < 0 ) {
      this.offsetLeftPx = this.timelineWidthPx - this.widthPx;
    }

    this.reCalculateTime();
  }

  // Переместить левую границу трека
  public moveLeft(offset: number): void {
    const newOffsetLeftPx = this.offsetLeftPxBeforeMoveing + offset;
    if ( newOffsetLeftPx >= 0 && ( this.widthPxBeforeMoveing >= offset ) ) {
      this.offsetLeftPx = newOffsetLeftPx;
      this.widthPx = this.widthPxBeforeMoveing - offset;
    } else if ( newOffsetLeftPx < 0 ) {
      this.offsetLeftPx = 0;
      this.widthPx = this.widthPxBeforeMoveing + this.offsetLeftPxBeforeMoveing;
    } else if ( this.widthPxBeforeMoveing < offset ) {
      this.offsetLeftPx = this.widthPxBeforeMoveing + this.offsetLeftPxBeforeMoveing;
      this.widthPx = 0;
    }

    this.reCalculateTime();
  }

  // Переместить правую границу трека
  public moveRight(offset: number): void {
    const newWidthPx = this.widthPxBeforeMoveing + offset;
    const newOffsetRightPx = this.getOffsetRightPx(undefined, newWidthPx);
    if ( newWidthPx >= 0 && newOffsetRightPx >= 0 ) {
      this.widthPx = newWidthPx;
    } else if ( newWidthPx < 0 ) {
      this.widthPx = 0;
    } else if ( newOffsetRightPx < 0 ) {
      this.widthPx = this.timelineWidthPx - this.offsetLeftPx;
    }

    this.reCalculateTime();
  }

  // Пекратить перетаскивание трека по таймлайну
  public stopMoveing(): void {
    this.isMoveing = false;
  }

  // Определить текущий отступ справа
  private getOffsetRightPx(replaceOffsetLeftPx?: number, replaceWidthPx?: number): number {
    const offsetLeftPx = ( replaceOffsetLeftPx ) ? replaceOffsetLeftPx : this.offsetLeftPx;
    const widthPx = ( replaceWidthPx ) ? replaceWidthPx : this.widthPx;
    const result = this.timelineWidthPx - ( offsetLeftPx + widthPx );
    return result;
  }

  // Посчитать время до начала воспроизведения в минутах
  private getTimeBeforeInMinutes(): number {
    return this.timelineLengthMinutes / this.timelineWidthPx * this.offsetLeftPx;
  }

  // Пересчитать время трека в зависимости от положения на таймлайне
  private reCalculateTime(): void {
    const timeBeforeInMinutes = this.getTimeBeforeInMinutes();
    this.startMinute = timeBeforeInMinutes % 60;
    this.startHour = ( timeBeforeInMinutes - this.startMinute ) / 60;
    this.durationMinute = this.timelineLengthMinutes / this.timelineWidthPx * this.widthPx;

    this.reCalculateDateFromTo();
  }

  // Посчитать дату начала и окончания воспроизведения
  private reCalculateDateFromTo(): void {
    const dateFrom = new Date();
    dateFrom.setHours(this.startHour);
    dateFrom.setMinutes(this.startMinute);

    const timeBeforeInMinutes = this.getTimeBeforeInMinutes();
    const endMinute = ( timeBeforeInMinutes + this.durationMinute ) % 60;
    const endHour = ( ( timeBeforeInMinutes + this.durationMinute ) - endMinute ) / 60;
    const dateTo = new Date();
    dateTo.setHours(endHour);
    dateTo.setMinutes(endMinute);

    this.dateFrom = dateFrom;
    this.dateTo = dateTo;
  }

}
