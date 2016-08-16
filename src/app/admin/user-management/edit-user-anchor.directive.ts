import { Directive, ComponentFactoryResolver, ComponentFactory, ComponentRef } from '@angular/core';

import { ViewContainerRef } from '@angular/core';
import { EditUserComponent } from './edit-user';

@Directive({
  selector: '[edit-user-anchor]'
})
export class EditUserAnchorDirective {

  constructor(private viewContainer: ViewContainerRef,
              private componentFactoryResolver: ComponentFactoryResolver
  ) {}
/*

  createDialog(
    editUserComponent: EditUserComponent
    //editUserComponent: { new(): EditUserComponent }
    ):Promise<ComponentRef<EditUserComponent>> {
    this.viewContainer.clear();

    let componentCreated = this.componentFactoryResolver
      .resolveComponentFactory(editUserComponent)
      .then((editUserComponentFactory: ComponentFactory<EditUserComponent>) => {
        return this.viewContainer.createComponent(editUserComponentFactory);
      });

    componentCreated.then((editUserComponentRef: ComponentRef<EditUserComponent>) => {
      editUserComponentRef.instance.close.subscribe(() => {
        editUserComponentRef.destroy();
      });
    });

    return componentCreated;
  }
*/

}
