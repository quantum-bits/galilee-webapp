import {Directive, ComponentFactoryResolver, ComponentRef} from '@angular/core';

import {ViewContainerRef} from '@angular/core';
import {DialogComponent} from './dialog.component.ts';

@Directive({selector: '[dialogAnchor]'})
export class DialogAnchorDirective {
  constructor(private viewContainer: ViewContainerRef,
              private componentFactoryResolver: ComponentFactoryResolver) {
  }

  createDialog(dialogComponent: { new(): DialogComponent }): ComponentRef<DialogComponent> {
    this.viewContainer.clear();

    let dialogComponentFactory = this.componentFactoryResolver.resolveComponentFactory(dialogComponent);

    let componentCreated = this.viewContainer.createComponent(dialogComponentFactory);

    componentCreated.instance.close.subscribe(() => {
      componentCreated.destroy();
    });

    return componentCreated;
  }
}
