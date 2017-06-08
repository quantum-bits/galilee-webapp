import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appEditOrganizationModalAnchor]'
})
export class EditOrganizationModalAnchorDirective {

  constructor(public viewContainer: ViewContainerRef) { }

}
