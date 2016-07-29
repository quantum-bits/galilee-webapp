import { Directive, AfterViewInit, Input } from '@angular/core';

/*
  This directive is used to "wake up" a dynamically-generated materialize input, so
  that the label doesn't sit on top of the content in the input.  To use this directive,
  do the following:
   - import it into the component and include it in the list of directives, and
   - use the following syntax in the template:
        <input [input-wake-up]="'caption'" id="caption" .... type="text" ...>
        <label for="caption">Caption</label>
   - if inside of an ngFor repeater, can do the following (to get unique id's):
        <div *ngFor="let item of items; let i=index">
          <input [input-wake-up]="'caption'+i" id="caption{{i}}" .... type="text" ...>
          <label [attr.for]="'caption'+i">Caption</label>
        </div>
 */
declare var $: any; // for using jQuery within this angular directive

@Directive({
  selector: '[input-wake-up]'
})
export class InputWakeUp implements AfterViewInit {

  @Input('input-wake-up') inputID: string;

  constructor() {}

  ngAfterViewInit() {
    $('#'+this.inputID).trigger('change');
  }
}
