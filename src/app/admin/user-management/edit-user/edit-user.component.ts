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
import {UpdateUserData} from '../../../shared/interfaces/update-user-data.interface';

const MIN_PASSWORD_LENGTH: number = 6;

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {
  /*
   Use cases for userData and updateField:
   - new user: do not pass in userData upon instantiating the component
   - self-updating existing user:
      - set userData to the user's User object
      - set updateField to the field being updated ('name', 'email' or 'password')
   - admin updating existing user from the manage-users page:
      - modal and component are launched 'on the fly' (using @ViewChild, etc.), and
        userData is set after the fact
      - updateField is left as null (the admin is presented with a "long" form, and potentially all fields can be updated)
   */
  @Input() userData: User = null; // only pass in if updating a current user; otherwise null
  @Input() updateField: string = null;// only pass in if updating a current user; can be 'name', 'email' or 'password'

  //close = new EventEmitter();

  onFinished = new EventEmitter<string>();

  private permissionTypes: Permission[];//types of permissions possible
  userForm: FormGroup; // our model driven form
  signinServerError: any;

  isNewUser: boolean;
  currentUserIsAdmin: boolean; //eventually use a method on the currentUser object

  public submitted: boolean; // keep track of whether form is submitted

  adminUpdatingPassword: boolean = false; // when an admin updates a user's data, there is an option of updating or not updating the password field

  constructor(private router: Router,
              private formBuilder: FormBuilder,
              private userService: UserService) {
    console.log('inside edit-user constructor');
  }

  ngOnInit() {

    console.log('inside edit-user oninit; update field is: ', this.updateField);
    console.log('here is null: ', null);
    console.log('...and userData is: ', this.userData);

    console.log('ADMIN is: ', ADMIN);
    console.log('typeof ADMIN is: ', typeof ADMIN);

    this.currentUserIsAdmin = false;
    // get rid of current user

    if (this.userService.isLoggedIn()) {
      console.log('user can ADMIN: ', this.userService.can(ADMIN));
      console.log('current user: ', this.userService.getCurrentUser());
      this.currentUserIsAdmin = this.userService.can(ADMIN);
      console.log('currentUserIsAdmin: ', this.currentUserIsAdmin);
      //this.userService.can(ADMIN).subscribe(
      //  can => {
      //    console.log('current user has ADMIN permission: ', can);
      //  }
      //);
    }


    // TODO: check whether currentUser is actually an admin
    console.log('inside ngOnInit of edit-user, here is userData:');
    console.log(this.userData);

    if (this.userData === null){
      this.isNewUser = true;
    } else {
      this.isNewUser = false;
    }
    this.initializeForm();
  }

  initializeForm() {
    if (this.currentUserIsAdmin) {
      this.userService.getPermissionTypes().subscribe(
        permissions => {
          this.permissionTypes = [];
          for (let permission of permissions) {
            this.permissionTypes.push(new Permission(permission));
          }
          ;
          console.log('types of permissions: ', this.permissionTypes);

          if (this.isNewUser) {
            this.createEmptyUserData(); // fills userData with initial values
            console.log(this.userData);
          }
          this.createUserForm();
        },
        err => console.log("ERROR", err),
        () => console.log("Permission types fetched"));
    } else {
      this.permissionTypes = [];
      if (this.isNewUser) {
        this.createEmptyUserData(); // fills userData with initial values
        console.log(this.userData);
      }
      this.createUserForm();
    }
  }

  createEmptyUserData() {
    this.userData = new User({
      id: null,//this will be assigned by the server-side code later
      email: '',
      firstName: '',
      lastName: '',
      joinedOn: null,//this will be assigned by the server-side code later
      enabled: true,
      preferredVersionId: null,
      permissions: [],
      groups: []
    });
  }

  /*
    this method builds the 'permissions' part of the form; note that permissionTypes is set to []
    unless the currentUser is an ADMIN;
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
    return permissionArray;
  }

  initPermission(permissionInfo: Permission, hasPermission: boolean) {
    // initialize our resource
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
      return {error: 'This field must have the form of an email address.'};
    }
  }

  passwordValidator(control) {
    if (control.value.length < MIN_PASSWORD_LENGTH) {
      console.log('control: ', control);
      return {error: 'Password must be at least six characters.'};
    }
  }

  passwordWhitespaceValidator(control) {
    //make sure that password does not have leading or trailing whitespace
    if (control.value.trim() !== control.value) {
      console.log('control: ', control);
      return {error: 'Password may not contain spaces at the beginning or end.'};
    }
  }

  postNewUser(){
    // TODO: add 'enabled' as well...(?); maybe that only needs to
    //       get added below, in the adminUpdate() method
    this.userService.signup(
      this.userForm.value.email,
      this.userForm.value.passwords.password,
      this.userForm.value.firstName,
      this.userForm.value.lastName
    ).subscribe(
      (result) => {
        console.log('result from attempt to create new user: ', result);
        if (result.ok) {
          console.log('new user created OK!');
          //this.close.emit('event');
          if (this.currentUserIsAdmin) {
            let refreshUsers: boolean = true;
            this.userService.announceCloseAndCleanUp(refreshUsers);
          } else {
            this.router.navigate(['/signup-success']);
          }
        }
      },
      (error) => {
        console.log('there was an error');
        this.signinServerError = JSON.parse(error._body).message;
      }
    );
  }

  adminUpdate(){
    // this method is used when an admin is updating his or herself, or another user,
    // using the "long form" available from the manage-users page
    let preferredVersionId = this.userForm.value.preferredVersionId;
    let email = this.userForm.value.email;
    let password = this.userForm.value.passwords.password;
    let firstName = this.userForm.value.firstName;
    let lastName = this.userForm.value.lastName;

    let enabled = this.userForm.value.enabled;

    console.log(preferredVersionId, email, password, firstName, lastName, enabled);
    console.log(this.userData);

    let updateUserData: UpdateUserData = {
      email: email,
      firstName: firstName,
      lastName: lastName,
      password: password, //if this is an empty string, the password will not be reset
      enabled: enabled,
      preferredVersionId: preferredVersionId,
      // TODO: add in the following
      permissionIds: []
    }

    this.userService.adminUpdateUserData(this.userData.id, updateUserData)
      .subscribe(
      (result) => {
        console.log('result from attempt to update user: ', result);
        if (result.ok) {
          console.log('user updated!');
          //this.close.emit('event');
          /*
          if (this.currentUserIsAdmin) {
            let refreshUsers: boolean = true;
            this.userService.announceCloseAndCleanUp(refreshUsers);
          } else {
            this.router.navigate(['/signup-success']);
          }
          */
        }
      },
      (error) => {
        console.log('there was an error');
        this.signinServerError = JSON.parse(error._body).message;
      }
    );

    /*

    WORKING HERE:
    - need to check if the user is an admin; if so, don't do a self-update,
      but do a separate one.  In particular, don't refresh setCurrentUser at the
      end unless the current user is actually the same as the user being updated!!!
    - not quite sure what the onClickedExit() and closeModal() methods do, but they may be
      a way to close a modal, eventually....
    - need some new api endpoints for patching a user (not as a self-update)
    - need some new api endpoints for adding permissions on a post/patch




     */








  }


  selfUpdateName(){//only updates name
    console.log('here is the user id: ', this.userData.id);
    let firstName = this.userForm.value.firstName;
    let lastName = this.userForm.value.lastName;
    this.userService.updateName(this.userData.id, firstName, lastName)
      .subscribe(
      (result) => {
        console.log('result from attempt to update user: ', result);
        //this.router.navigate(['/end-user']);
        if (result.ok) {
          console.log('user updated OK!');
          this.userData.firstName = firstName;
          this.userData.lastName = lastName;
          this.userService.setCurrentUser(this.userData);
          this.router.navigate(['self-update-success']);
        }
      },
      (error) => {
        console.log('there was an error');
        console.log(error);
        this.signinServerError = JSON.parse(error._body).message;
      }
    );
  }

  selfUpdateEmail(){//only updates email
    let email = this.userForm.value.email;
    this.userService.updateEmail(this.userData.id, email)
      .subscribe(
        (result) => {
          console.log('result from attempt to update user: ', result);
          //this.router.navigate(['/end-user']);
          if (result.ok) {
            console.log('user updated OK!');
            this.userData.email = email;
            this.userService.setCurrentUser(this.userData);
            this.router.navigate(['self-update-success']);
          }
        },
        (error) => {
          console.log('there was an error');
          console.log(error);
          this.signinServerError = JSON.parse(error._body).message;
        }
      );
  }

  selfUpdatePassword(){//only updates password
    let password = this.userForm.value.passwords.password;
    this.userService.updatePassword(this.userData.id, password)
      .subscribe(
        (result) => {
          console.log('result from attempt to update user: ', result);
          //this.router.navigate(['/end-user']);
          if (result.ok) {
            console.log('user updated OK!');
            this.router.navigate(['self-update-success']);
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
    console.log('update field', this.updateField);
    if (this.userForm.valid) {
      this.signinServerError = null;//reinitialize it....
      if (this.isNewUser) {
        this.postNewUser();
      } else {
        switch (this.updateField) {
          case 'name': {
            this.selfUpdateName();
            break;
          }
          case 'email': {
            this.selfUpdateEmail();
            break;
          }
          case 'password': {
            this.selfUpdatePassword();
            break;
          }
          case null: {
            // presumably the user is an admin and is updating his or herself or someone else, using the long form from the manage-users page;
            // make sure the user is, in fact, an admin....
            if (this.currentUserIsAdmin) {
              this.adminUpdate();
            } else {
              // TODO: what to do in this case?  shouldn't arise....
            }
            break;
          }
          default: {
            // TODO: what to do in this case?
            break;
          }
        }
      }
    } else {
      // TODO: what to do in this case?  Shouldn't happen, since the submit
      //       button only appears if the form is valid, but should we do something
      //       just in case?
    }
  }

  // used in the template and in createUserForm() to decide whether or not to show a given field;
  // field can be 'name', 'email' or 'password'
  exposeField(field: string){
    if ((this.isNewUser)||(this.updateField === field)){
      return true;
    }
    if ((this.updateField === null)&&(field !== 'password')) {
      return true;
    }
    if (field === 'password') {
      if ((this.updateField === null) && (this.currentUserIsAdmin) && (this.adminUpdatingPassword)) {
        return true;
      }
    }
    return false;
  }

  /*
    This method creates the user form; the password is a special case, since it
    is not contained in the User object.  If the user is updating just the 'name'
    or 'email' fields, then we don't want to try to validate the password fields.
    On the other hand, when updating the 'password' field, the other fields are
    actually in the form, and already valid.  If an admin is editing a user's data,
    the admin can choose to update or not update the password field.
  */
  createUserForm(){
    // generically add the password fields to the form, but don't make them required
    this.userForm = this.formBuilder.group({
      email: [this.userData.email, Validators.compose([<any>Validators.required, this.emailValidator])],
      passwords: this.formBuilder.group({
        password: [''],
        password2: ['']
      }, {validator: this.areEqual}),
      firstName: [this.userData.firstName, [<any>Validators.required]],
      lastName: [this.userData.lastName, [<any>Validators.required]],
      enabled: [this.userData.enabled, [<any>Validators.required]],
      preferredVersionId: [this.userData.preferredVersionId],
      permissions: this.formBuilder.array(
        this.initPermissionArray(this.userData.permissions, this.permissionTypes)),
    });
    if (this.exposeField('password')) {
      // if the 'password' field is exposed in the form, make it required and make it conform to the minimum length, etc.
      this.enforcePasswordValidation();
    }
  }

  enforcePasswordValidation() {
    let passwordsControl = this.formBuilder.group({
      password: ['', Validators.compose([<any>Validators.required, this.passwordValidator, this.passwordWhitespaceValidator])],
      password2: ['', Validators.compose([<any>Validators.required, this.passwordValidator, this.passwordWhitespaceValidator])]
    }, {validator: this.areEqual});
    this.userForm.setControl('passwords',passwordsControl);
  }

  ceasePasswordValidation() {
    let passwordsControl = this.formBuilder.group({
      password: [''],
      password2: ['']
    }, {validator: this.areEqual});
    this.userForm.setControl('passwords',passwordsControl);
  }

  /*
  I think this is not being used....
  onClickedExit() {
    this.close.emit('event');
  }
  */

  togglePasswordUpdate(event) {
    this.adminUpdatingPassword = !this.adminUpdatingPassword;
    if (this.adminUpdatingPassword) {
      this.enforcePasswordValidation();
    } else {
      this.ceasePasswordValidation();
    }
  }



}
