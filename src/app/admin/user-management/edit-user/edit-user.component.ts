import {Component, OnInit, EventEmitter, Input} from '@angular/core';
import {Router} from '@angular/router';

import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators, // used to make a field required
  FormControl
} from '@angular/forms';

import {User} from '../../../shared/models/user.model';
import {Permission} from '../../../shared/models/permission.model';

import {UserService} from '../../../authentication/user.service';

import {ADMIN} from '../../../shared/models/permission.model';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {
  /*
   Use cases for userData:
   - new user: do not pass in userData upon instantiating the component
   - updating existing user: set userData to the user's User object
      - if want to update only one field ('name', 'email' or 'password') then pass that in to the component as updateField
   - (needs to be updated) updating existing user, but launching 'on the fly' (using @ViewChild, etc.):
      set userData after the fact (see manage-users.component for an example)
   */
  @Input() userData: User; // only pass in if updating a current user; otherwise undefined
  @Input() updateField: string;// only pass in if updating a current user; can be 'name', 'email' or 'password'

  close = new EventEmitter();

  onFinished = new EventEmitter<string>();

  private permissionTypes: Permission[];//types of permissions possible
  public userForm: FormGroup; // our model driven form
  private signinServerError: any;

  private isNewUser: boolean;
  private currentUserIsAdmin: boolean; //eventually use a method on the currentUser object

  //private currentUser: User;// the user who is currently logged in

  public submitted: boolean; // keep track of whether form is submitted

  constructor(private router: Router,
              private formBuilder: FormBuilder,
              private userService: UserService) {
    console.log('inside edit-user constructor');
  }

  ngOnInit() {

    console.log('inside edit-user oninit; update field is: ', this.updateField);

    console.log('ADMIN is: ', ADMIN);
    console.log('typeof ADMIN is: ', typeof ADMIN);

    // get rid of current user

    if (this.userService.isLoggedIn()) {
      //this.userService.can(ADMIN).subscribe(
      //  can => {
      //    console.log('current user has ADMIN permission: ', can);
      //  }
      //);
    }


    // TODO: check whether currentUser is actually an admin
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

  initializeForm() {
    this.userService.getPermissionTypes().subscribe(
      permissions => {
        this.permissionTypes = [];
        for (let permission of permissions) {
          this.permissionTypes.push(new Permission(permission));
        };
        console.log('types of permissions: ', this.permissionTypes);

        if (this.isNewUser) {
          this.createEmptyUserData(); // fills userData with initial values
          console.log(this.userData);
        }
        this.createUserForm();
      },
      err => console.log("ERROR", err),
      () => console.log("Permission types fetched"));
  }


  /*
   this.id = obj.id;
   this.email = obj.email;
   this.firstName = obj.firstName;
   this.lastName = obj.lastName;
   this.joinedOn = obj.joinedOn;
   this.enabled = obj.enabled;
   this.preferredVersionID = obj.preferredVersionId;
   this.permissions = [];
   */

  createEmptyUserData() {
    this.userData = new User({
      id: null,//this will be assigned by the server-side code later
      email: '',
      firstName: '',
      lastName: '',
      joinedOn: null,//this will be assigned by the server-side code later
      enabled: true,
      preferredVersionID: null,
      permissions: []
    });
  }

  /*
    this method builds the 'permissions' part of the form;
    Note: the entries in the userPermissions array are those which are 'enabled' for the user;
          the permissionArray form that is returned by the method contains all of the permissionTypes,
          with an additional property, enabled, which is a boolean
   */
  initPermissionArray(userPermissions: Permission[], permissionTypes: Permission[]) {
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

  initPermission(permissionInfo: Permission, hasPermission: boolean) {
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

  postNewUser(){
    this.userService.signup(
      this.userForm.value.email,
      this.userForm.value.passwords.password,
      this.userForm.value.firstName,
      this.userForm.value.lastName
    ).subscribe(
      (result) => {
        console.log('result from attempt to create new user: ', result);
        //this.router.navigate(['/end-user']);

        console.log('type of result.ok: ', typeof result.ok);
        console.log(result.ok);

        if (result.ok) {
          console.log('new user created OK!');
          //this.close.emit('event');
          this.router.navigate(['/signup-success']);

          //  this.closeModal(this.modalID);
        }
      },
      (error) => {
        console.log('there was an error');
        this.signinServerError = JSON.parse(error._body).message;
      }
    );
  }


  selfUpdateExistingUser(){//only updates name and/or email
    let user = new User({
      id: this.userData.id,
      email: this.userForm.value.email,
      firstName: this.userForm.value.firstName,
      lastName: this.userForm.value.lastName,
      joinedOn: this.userData.joinedOn,
      enabled: this.userData.enabled,
      preferredVersionID: this.userData.preferredVersionID,
      permissions: this.userData.permissions
    });

    console.log('about to post the result; here is the user object: ', user);
    console.log('typeof id: ', typeof user.id);

    this.userService.update(user).subscribe(
      (result) => {
        console.log('result from attempt to update user: ', result);
        //this.router.navigate(['/end-user']);

        console.log('type of result.ok: ', typeof result.ok);
        console.log(result.ok);

        if (result.ok) {
          console.log('user updated OK!');
          //this.close.emit('event');
          //this.router.navigate(['/signup-success']);

          //  this.closeModal(this.modalID);
        }
      },
      (error) => {
        console.log('there was an error');
        console.log(error);
        this.signinServerError = JSON.parse(error._body).message;
      }
    );
  }


  onSubmit() {
    console.log(this.userForm);

    // WORKING HERE:
    // 2. give an error message for the 400, 401, etc., errors
    // 3. make sure the logic makes sense for both positive and negative results!!!
    // 4. double-check login for #3....

    if (this.userForm.valid) {
      this.signinServerError = null;//reinitialize it....
      if (this.isNewUser) {
        this.postNewUser();
      } else {
        this.selfUpdateExistingUser();
      }


    }
  }

  // used in the template and in createUserForm() to decide whether or not to show a given field;
  // field can be 'name', 'email' or 'password'
  exposeField(field: string){
    if ((this.isNewUser)|| (this.updateField === undefined)||(this.updateField === field)){
      return true;
    } else {
      return false;
    }
  }

  /*
    This method creates the user form; the password is a special case, since it
    is not contained in the User object.  If the user is updating just the 'name'
    or 'email' fields, then we don't want to try to validate the password fields,
    since there is nothing there.  On the other hand, when updating the 'password'
    field, the other fields are actually in the form, and already valid.
  */
  createUserForm(){
    if (this.exposeField('password')) {
      this.userForm = this.formBuilder.group({
        email: [this.userData.email, Validators.compose([<any>Validators.required, this.emailValidator])],
        passwords: this.formBuilder.group({
          password: ['', [<any>Validators.required]],
          password2: ['', [<any>Validators.required]]
        }, {validator: this.areEqual}),
        firstName: [this.userData.firstName, [<any>Validators.required]],
        lastName: [this.userData.lastName, [<any>Validators.required]],
        enabled: [true, [<any>Validators.required]],
        preferredVersionID: [this.userData.preferredVersionID],
        permissions: this.formBuilder.array(
          this.initPermissionArray(this.userData.permissions, this.permissionTypes)),
      });
    } else {
      this.userForm = this.formBuilder.group({
        email: [this.userData.email, Validators.compose([<any>Validators.required, this.emailValidator])],
        firstName: [this.userData.firstName, [<any>Validators.required]],
        lastName: [this.userData.lastName, [<any>Validators.required]],
        enabled: [true, [<any>Validators.required]],
        preferredVersionID: [this.userData.preferredVersionID],
        permissions: this.formBuilder.array(
          this.initPermissionArray(this.userData.permissions, this.permissionTypes)),
      });
    }

    console.log(this.userForm);
  }


  onClickedExit() {
    this.close.emit('event');
  }

}
