import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'byteConversion'
})
export class ByteConversionPipe implements PipeTransform {

  transform(numBytes: number, sigFigs?: number): string {
    /**
     * converts the number of bytes into a string
     *    examples:
     *              980       => '980 bytes'
     *              1,255     => 1.23 kB, 1.2 kB, etc., depending on the number of sigFigs requested
     *              3,456,789 => 3.297 MB, 3.3 MB, etc.
     */

    if (numBytes <= 1024) {
      return numBytes.toString()+' bytes';
    } else if (numBytes <= 1048576) {
      let numKBytes = numBytes/1024;
      let numKBytesRounded: string;
      if (sigFigs) {
        // see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toPrecision
        numKBytesRounded = numKBytes.toPrecision(sigFigs);
      } else {
        numKBytesRounded = numKBytes.toPrecision(3);
      }
      return numKBytesRounded.toString()+' kB';
    } else {
      let numMBytes = numBytes/1048576;
      let numMBytesRounded: string;
      if (sigFigs) {
        numMBytesRounded = numMBytes.toPrecision(sigFigs);
      } else {
        numMBytesRounded = numMBytes.toPrecision(3);
      }
      return numMBytesRounded.toString()+' MB';
    }
  }

}
