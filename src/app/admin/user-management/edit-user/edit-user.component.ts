import {Component, OnInit, EventEmitter, Input, OnChanges} from '@angular/core';

import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators, // used to make a field required
  FormControl
} from '@angular/forms';

import {User} from '../../../shared/models/user.model';
import {UserPermission} from '../../../shared/models/user-permission.model';

import {UserService} from '../../../authentication/user.service';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit, OnChanges {
  /*
   Use cases for userData:
   - new user: do not set userData
   - updating existing user: set userData to the user's User object
   - updating existing user, but launching 'on the fly' (using @ViewChild, etc.):
   set userData after the fact (see manage-users.component for an example)
   */
  @Input() userData: any;

  close = new EventEmitter();

  onFinished = new EventEmitter<string>();

  message: string = 'Hello, I\'m a dialog box!';

  private permissionTypes: UserPermission[];//types of permissions possible
  public userForm: FormGroup; // our model driven form
  private signinServerError: any;

  private isNewUser: boolean;
  private currentUserIsAdmin: boolean;

  private currentUser: User;// the user who is currently logged in

  public submitted: boolean; // keep track of whether form is submitted

  private date = new Date();
  // date.toISOString()

  constructor(private formBuilder: FormBuilder,
              private userService: UserService) {
    console.log('inside edit-user constructor');
  }

  ngOnInit() {
    if (this.userService.isLoggedIn()) {
      this.userService
        .getCurrentUser()
        .subscribe(user => {
          this.currentUser = user;
          // check if currentUser is an admin.... for now, assume not
        });
    }
    // TODO: fix this....
    this.currentUserIsAdmin = false;
    console.log('inside ngOnInit of edit-user, here is userData:');
    console.log(this.userData);

    if (this.userData === undefined){
      this.isNewUser = true;
    } else {
      this.isNewUser = false;
    }
    this.initializeForm();
  }

  ngOnChanges() {
    console.log('change detected in edit-user!');
  }

  initializeForm() {
    // FIXME need to make sure only to show user permissions in the form only if the current
    // user is an admin
    this.userService.getInitialUserPermissions().subscribe(
      permissions => {
        this.permissionTypes = permissions;
        console.log('types of permissions: ', this.permissionTypes);

        if (this.isNewUser) {
          this.createEmptyUserData(); // fills userData with initial values
          console.log(this.userData);
        }
        this.userForm = this.formBuilder.group({
          id: [this.userData.id, [<any>Validators.required]],
          email: [this.userData.email, Validators.compose([<any>Validators.required, this.emailValidator])],
          passwords: this.formBuilder.group({
            password: [this.userData.password, [<any>Validators.required]],
            password2: [this.userData.password, [<any>Validators.required]]
          }, {validator: this.areEqual}),
          firstName: [this.userData.firstName, [<any>Validators.required]],
          lastName: [this.userData.lastName, [<any>Validators.required]],
          joinedOn: [this.date.toISOString(), [<any>Validators.required]],//maybe fill this in upon submission instead...?!?
          enabled: [true, [<any>Validators.required]],
          preferredVersionID: [this.userData.preferredVersionID],
          permissions: this.formBuilder.array(
            this.initPermissionArray(this.userData.permissions, this.permissionTypes)),
        });

        console.log(this.userForm);

      },
      err => console.log("ERROR", err),
      () => console.log("Permission types fetched"));
  }


  createEmptyUserData() {
    this.userData = {
      id: 0, // id will eventually need to be managed by the server-side code
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      joinedOn: '',
      enabled: true,
      preferredVersionID: null,
      permissions: []
    }
  }

  initPermissionArray(userPermissions: UserPermission[], permissionTypes: UserPermission[]) {
    // entries in the permissions array are 'enabled' for the user; absence of an
    // entry implies that the user does not have the corresponding permission

    //this.userData.permissions, this.permissionTypes

    console.log(userPermissions);
    let permissionArray = [];
    let hasPermission: boolean;
    for (let permissionType of permissionTypes) {
      hasPermission = false;
      for (let userPermission of userPermissions) {
        if (userPermission.id === permissionType.id) {
          // user has this permission type
          hasPermission = true;
        }
      }
      permissionArray.push(this.initPermission(permissionType, hasPermission));
    }
    console.log('here is the permission Array: ', permissionArray);
    return permissionArray;
  }

  initPermission(permissionInfo: UserPermission, hasPermission: boolean) {
    // initialize our resource
    console.log('about to initialize new permission');
    console.log(permissionInfo);
    return this.formBuilder.group({
      id: [permissionInfo.id, Validators.required],
      title: [permissionInfo.title, Validators.required],
      enabled: [hasPermission, Validators.required]
    });
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


  areEqual(group) {
    if (group.value.password === group.value.password2) {
      return null;
    } else {
      return {error: 'Passwords must match.'};
    }
  }

  emailValidator(control) {
    //see: http://stackoverflow.com/questions/34072092/generic-mail-validator-in-angular2
    var EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;

    if (!EMAIL_REGEXP.test(control.value)) {
      return {invalidEmail: true};
    }
  }


  onSubmit() {
    console.log(this.userForm);

    // WORKING HERE:
    // 2. give an error message for the 400, 401, etc., errors
    // 3. make sure the logic makes sense for both positive and negative results!!!
    // 4. double-check login for #3....

    if (this.userForm.valid) {
      this.signinServerError = null;//reinitialize it....
      this.userService.signup(
        this.userForm.value.email,
        this.userForm.value.passwords.password,
        this.userForm.value.firstName,
        this.userForm.value.lastName
      ).subscribe(
        (result) => {
          console.log('back in the login component');
          console.log(result);
          //this.router.navigate(['/end-user']);

          if (result.ok) {
            this.close.emit('event');
            //  this.closeModal(this.modalID);
          }
        },
        (error) => {
          console.log('there was an error');
          console.log(error);
          this.signinServerError = error;
        }
      );
    }
  }

  displayForm() {
    console.log(this.userForm);
    //console.log(this.userForm.controls.passwords.controls.password2.touched && !this.userForm.controls.passwords.controls.valid);
  }


  onClickedExit() {
    this.close.emit('event');
  }

}
