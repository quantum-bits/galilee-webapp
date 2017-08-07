import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appResourceModalAnchor]'
})
export class ResourceModalAnchorDirective {

  constructor(public viewContainer: ViewContainerRef) { }

}
