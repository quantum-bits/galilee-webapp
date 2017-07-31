import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appResourceItemModalAnchor]'
})
export class ResourceItemModalAnchorDirective {

  constructor(public viewContainer: ViewContainerRef) { }

}
