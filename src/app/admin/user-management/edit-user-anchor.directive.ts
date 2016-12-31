import { Directive, ComponentFactoryResolver, ComponentRef
// , ComponentFactory, ComponentRef
} from '@angular/core';

import { ViewContainerRef } from '@angular/core';
import { EditUserComponent } from './edit-user';

import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators, // used to make a field required
  FormControl
} from '@angular/forms';

//import { UserService } from '../../authentication/user.service';



@Directive({
  selector: '[editUserAnchor]'
})
export class EditUserAnchorDirective {

  constructor(private viewContainer: ViewContainerRef,
              private componentFactoryResolver: ComponentFactoryResolver
  ) {
    console.log('inside constructor');
  }

  createDialog(editUserComponent) {
    this.viewContainer.clear();

    let editUserComponentFactory = this.componentFactoryResolver.resolveComponentFactory(editUserComponent);

    let componentCreated = this.viewContainer.createComponent(editUserComponentFactory);

    // TODO - This is causing compile errors [nurk 2016-09-20]
    // componentCreated.instance.close.subscribe(() => {
    //   componentCreated.destroy();
    // });

    return componentCreated;
  }


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
