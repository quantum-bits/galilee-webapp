import { Pipe, PipeTransform } from '@angular/core';

import * as truncate from "html-truncate";

/**
 * This pipe truncates a longer piece of text to a specified number of characters.
 * Usage:
 *   {{ 'long string of text' | truncate : 3 }}
 * Yields:
 *   'long string of....'
 */

@Pipe({
  name: 'truncate'
})
export class TruncatePipe implements PipeTransform {

  /**
   * original version adapted from:
   *    http://youknowriad.github.io/angular2-cookbooks/pipe.html
   *    https://angular.io/docs/ts/latest/guide/pipes.html
   * now using html-truncate package instead, to keep html tags safe:
   *    https://github.com/huang47/nodejs-html-truncate
   *
   * KNOWN ISSUE:
   *    - if the original string contains '... <sup class="someClass">...',
   *      the truncated string might contain '... <sup ...', with no closing '>'
   *      on the sup tag.  The html doesn't seem to suffer too badly from this
   *      when displayed, but the ellipsis is missing.
   *
   * POSSIBLE FIX:
   *    - instead of using html-truncate, could use the npm package truncate-html
   *      on the server-side code (that package doesn't work in the browser), and send back a full version of the text as well
   *      as an abbreviated version.  Would probably only need to do this for
   *      Bible passages, since that is the only place the <sup> tag seems to be
   *      used at the moment....
   */

  transform(value: string, minNumChars: number) : string {
    let truncatedString = truncate(value, minNumChars, { keepImageTag: true });
    if (value.length == 0) {
      return value;
    }
    return truncate(value, minNumChars, { keepImageTag: true });

    /*
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
    */

  }

}
