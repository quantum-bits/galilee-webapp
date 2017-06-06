import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appEditGroupModalAnchor]'
})
export class EditGroupModalAnchorDirective {

  constructor(public viewContainer: ViewContainerRef) { }

}
