import { Directive, ComponentFactoryResolver, ComponentRef} from '@angular/core';

import { ViewContainerRef } from '@angular/core';

/*
  This directive is deprecated, in favour of edit-user-modal-anchor.directive
 */

@Directive({
  selector: '[editUserAnchor]'
})
export class EditUserAnchorDirective {

  constructor(public viewContainer: ViewContainerRef//,
              //private componentFactoryResolver: ComponentFactoryResolver
  ) {
    console.log('inside constructor');
  }

}
