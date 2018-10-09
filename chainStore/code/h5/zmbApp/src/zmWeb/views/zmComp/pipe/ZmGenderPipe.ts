import { Pipe, PipeTransform } from '@angular/core';




@Pipe({ name: 'zmGender' })
export class ZmGenderPipe implements PipeTransform {
  transform(gender: number): string {
    return gender == 1?'男':'女'
  }
}
