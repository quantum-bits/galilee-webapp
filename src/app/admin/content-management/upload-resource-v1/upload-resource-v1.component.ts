import {Component, EventEmitter, OnInit, DoCheck, Input, Output} from '@angular/core';
import {FileUploader} from 'ng2-file-upload';

import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators, // used to make a field required
  FormControl
} from '@angular/forms';

import {Resource} from '../../../shared/models/resource.model';
import {ResourceCollection} from '../../../shared/interfaces/resource-collection.interface';

//import { InputWakeUp } from '../../../shared/directives/input-wake-up.directive';
//import { TextareaAutoresize } from '../../../shared/directives/textarea-autoresize.directive';

import {UpdateResourceItemBindingService} from '../update-resource-item-binding.service';

const URL = '/api/resources';

declare var $: any; // for using jQuery within this angular component

// taken from: http://valor-software.com/ng2-file-upload/
// see: http://stackoverflow.com/questions/37625274/implementing-ng2-file-upload
//      ...for some helpful comments

@Component({
  selector: 'app-upload-resource-v1',
  templateUrl: './upload-resource-v1.component.html',
  styleUrls: ['./upload-resource-v1.component.css']
})
export class UploadResourceV1Component implements OnInit, DoCheck {

  //useful resources for forms, nested forms:
  //  https://scotch.io/tutorials/using-angular-2s-model-driven-forms-with-formgroup-and-formcontrol
  //  https://angular.io/docs/ts/latest/cookbook/dynamic-form.html
  // *https://scotch.io/tutorials/how-to-build-nested-model-driven-forms-in-angular-2

  // WORKING HERE....next steps:
  // - use event emitter to back-propagate stuff...
  //   TRICK: put some files in the images folder, and make those the ones that get 'uploaded';
  //   ...then should be able to update the data, and have the new version show up!
  // - reconfigure the EDIT button for editing resources (i.e., get rid of the link)
  // - launch the ADD resource modal properly...that is, without issuing a click event
  //   on the empty anchor tag :(
  // - (partly done) the upload queue card only needs to show up if there are actually things in the queue;
  //   a bit tricky, though...how about if something has been uploaded? not sure what happens
  //   to its actual status in the queue at that point, but presumably at that point we would
  //   want its card to show up, and we would want to remove it by clicking on the X for the card(?)
  // ISSUES:
  // - if the 'edit/upload' modal is in the foreground and you click and drag,
  //   it appears that you can pick up one of the 'dragula' components in the background(!);
  //   ...seems like that could be bad!  rearrange the order of the parent elements while
  //   editing the child!  yikes....
  //

  public uploader: FileUploader = new FileUploader({url: URL});
  public hasBaseDropZoneOver: boolean = false;
  public hasAnotherDropZoneOver: boolean = false;

  private numFiles = 0;

  @Input() newCollection: boolean;//true if this is a new collection; false if editing an existing collection
  @Input() resourceCollection: ResourceCollection;
  @Input() resourcePath: string;
  @Input() modalID: string;
  @Output() onFinished = new EventEmitter<string>();

  public resourceCollectionForm: FormGroup; // our model driven form
  public submitted: boolean; // keep track of whether form is submitted


  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  public fileOverAnother(e: any): void {
    this.hasAnotherDropZoneOver = e;
  }

  constructor(private fb: FormBuilder,
              private updateResourceItemBindingService: UpdateResourceItemBindingService) {
  }

  ngOnInit() {
    this.resourceCollectionForm = this.fb.group({
      id: [this.resourceCollection.id, [<any>Validators.required]],
      title: [this.resourceCollection.title, [<any>Validators.required]],
      description: [this.resourceCollection.description, [<any>Validators.required]],
      // TODO: Check that following change made by KK was correct...
      // this.initResourceArray -> this.initResourceFormArray
      resources: this.fb.array(
        this.initResourceFormArray(this.resourceCollection.resources)),
    });
  }

  ngDoCheck() {
    if (this.uploader.queue) {
      this.numFiles = this.uploader.queue.length;
    }
  }

  showQueue() {
    return this.uploader.queue.length > 0;
  }

  // TODO: Not sure which of the two duplicate functions was the correct one, so I commented
  // out this one for now (KK)
  //fileOverBase(e: any): void {
  //  this.hasBaseDropZoneOver = e;
  //}

  // TODO: Remove me.
  dumpUploaderDetails() {
    console.log(this.uploader);
  }

  initFileUploader() {
    this.uploader = new FileUploader({url: URL});
    this.uploader.onAfterAddingFile = fileItem => {
      this.addResource(new Resource(fileItem));
    }
  }

  //WORKING HERE: Should probably have (yet!) another component for the resource elements
  // in this modal...?  Not sure, but somehow each card/element needs to know if it is an
  // element in the queue or not.  If so, it needs to know its status.

  uploadItem(i: number) {
    this.uploader.onBuildItemForm = (item, form) => {
      form.append('collectionId', 42);
      form.append('caption', 'This is a test');
    };
    this.uploader.queue[i].upload();//this is a fileUploader method
    // >>>should somehow wait for success of the upload<<<
    // let resource: Resource;
    // resource = {
    //   id: 0,// not sure what to do with this at the moment....presumably it will eventually be assigned on the server side
    //   caption: '',
    //   type: 'image',
    //   fileName: this.uploader.queue[i]._file.name,
    //   copyrightInfo: ''
    // }
    // this.addResource(resource);
    console.log(this.resourceCollectionForm);
  }

  initResourceCollectionForm() {
    this.resourceCollectionForm = this.fb.group({
      id: [this.resourceCollection.id, [<any>Validators.required]],
      title: [this.resourceCollection.title, [<any>Validators.required]],
      description: [this.resourceCollection.description, [<any>Validators.required]],
      resources: this.fb.array(
        this.initResourceFormArray(this.resourceCollection.resources)),
    });
  }

  initResourceFormArray(resources: Resource[]) {
    console.log(resources);
    let resourceArray = [];
    for (let resource of resources) {
      resourceArray.push(this.initResourceForm(resource));
    }
    return resourceArray;
  }

  initResourceForm(resource: Resource) {
    console.log('about to initialize new resource');
    console.log(resource);
    return this.fb.group({
      caption: [resource.caption, Validators.required],
      copyrightYear: [resource.copyrightYear],
      copyrightOwner: [resource.copyrightOwner]
    });
  }

  addResource(resource: Resource) {
    // add resource to the list
    const control = <FormArray>this.resourceCollectionForm.controls['resources'];
    control.push(this.initResourceForm(resource));
  }

  removeResource(i: number) {
    // remove address from the list
    const control = <FormArray>this.resourceCollectionForm.controls['resources'];
    // remove element from the form....
    control.removeAt(i);
    // ...and also from the uploader queue, if appropriate
  }

  save(resourceCollection: ResourceCollection) {
    this.submitted = true; // set form submit to true
    // now send the data back, via the update-resource-item-binding service....
    let dataPacket = {
      resourceCollection: resourceCollection,
      newCollection: this.newCollection // true if we are adding a new collection, false if we are editing an existing one
    }
    this.updateResourceItemBindingService.updateResource(dataPacket);
    this.closeModal(this.modalID);
  }

  closeModal(modalID: string) {
    /*
     This emits an event that the parent component listens for; then the parent uses
     the modalID to close the modal.
     Note: The parent component must declare the following in order to close
     the modal programmatically:
     declare var $: any;
     */
    console.log('about to emit the close signal');
    this.onFinished.emit(modalID);
  }

}

