import { Pipe, PipeTransform } from '@angular/core';

/*
  This pipe truncates a longer piece of text to a specified number of words.
  Usage:
    {{ 'long string of text' | truncate : 3 }}
  Yields:
    'long string of....'
 */

@Pipe({
  name: 'truncate'
})
export class TruncatePipe implements PipeTransform {

  // adapted from:
  //     http://youknowriad.github.io/angular2-cookbooks/pipe.html
  //     https://angular.io/docs/ts/latest/guide/pipes.html

  transform(value: string, minNumWords: number) : string {
    if (value.length == 0) {
      return value;
    }
    let stringArray = value.split(" ");
    if (stringArray.length > minNumWords) {
      let truncatedString = '';
      for (var i=0; i<minNumWords; i++) {
        truncatedString+=stringArray[i];
        if (i !== minNumWords - 1) {
          truncatedString+= ' ';
        }
      }
      if (truncatedString.slice(-1) == '.') {
        return truncatedString + '...';
      } else {
        return truncatedString + '....';
      }
    } else {
      return value;
    }
  }

}
