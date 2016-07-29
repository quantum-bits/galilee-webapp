import { Directive, AfterViewInit, Input } from '@angular/core';

/*
   This directive is used to "autoresize" a dynamically-generated materialize textarea element, so
   that the textarea box is the right size for the content inside.  To use this directive,
   do the following:
    - import it into the component and include it in the list of directives, and
    - use the following syntax in the template:
      <input [textarea-autoresize]="'textarea'" id="textarea" .... class="materialize-textarea" ...>
      <label for="textarea">Description</label>
    - if inside of an ngFor repeater, can do the following (to get unique id's):
      <div *ngFor="let item of items; let i=index">
        <input [textarea-autoresize]="'textarea'+i" id="textarea{{i}}" .... class="materialize-textarea" ...>
        <label [attr.for]="'textarea'+i">Description</label>
      </div>
 */

declare var $: any; // for using jQuery within this angular directive

@Directive({
  selector: '[textarea-autoresize]'
})
export class TextareaAutoresize implements AfterViewInit {

  @Input('textarea-autoresize') inputID: string;

  constructor() {}

  ngAfterViewInit() {
    $('#'+this.inputID).trigger('autoresize');
  }
}

