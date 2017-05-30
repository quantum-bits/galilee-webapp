import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appEditUserModalAnchor]'
})
export class EditUserModalAnchorDirective {

  constructor(public viewContainer: ViewContainerRef) { }

}
