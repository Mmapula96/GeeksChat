import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timestamp'
})
export class TimestampPipe implements PipeTransform {

  transform(value: number[] | string): Date {
    if (typeof value === 'string') {
      // Convert string to array
      value = value.split(',').map(Number);
    }

    // Assuming value is an array [year, month, day, hour, minute, second]
    return new Date(value[0], value[1] - 1, value[2], value[3], value[4], value[5]);
  }
}