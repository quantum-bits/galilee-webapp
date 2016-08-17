import {Injectable} from '@angular/core';

import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';

import {Http, Headers} from '@angular/http';
import {contentHeaders} from './common/headers';

import {User} from '../shared/models/user.model';
import {Permission} from '../shared/models/permission.model';
import {UserPermission} from '../shared/models/user-permission.model';

//import localStorage from 'localStorage'; // I'm not sure why, but we apparently don't need to do this....

// Some examples of sending authenticated requests to the server may be found here:
//  https://medium.com/@blacksonic86/angular-2-authentication-revisited-611bf7373bf9#.6y6tryhmo
//  https://github.com/auth0-blog/angular2-authentication-sample/blob/master/src/home/home.ts
// NOTE: The latter uses authHttp, which (I think) uses the angular2-jwt package.  We have
//       installed that package, but it is not set up all the way yet (gives errors).  The
//       former approach sends an authenticated request without the help of the angular2-jwt package.

// dates:
//       ISO-8601 standard: YYYY-MM-DDTHH:mm:ss.sssZ
//       ref: http://www.w3schools.com/jsref/jsref_tojson.asp

const baseUrl = 'http://localhost:3001';

// MOCK

const USERS = [
    {
        id: 1,
        email: 'john@gmail.com',
        password: 'hash?',
        firstName: 'John',
        lastName: 'Ztgmail',
        joinedOn: '2016-08-11T19:13:27.360Z',
        enabled: false,
        preferredVersionID: 1,
        permissions: [
            {
                title: 'Edit Resources',
                id: 'EDIT_RES',
                enabled: false
            },
            {
                title: 'Edit Practices',
                id: 'EDIT_PRAC',
                enabled: true
            },
            {
                title: 'Admin',
                id: 'ADMIN',
                enabled: false
            }
        ]
    },
    {
        id: 2,
        email: 'jane@gmail.com',
        password: 'hash?',
        firstName: 'Jane',
        lastName: 'Atgmaal',
        joinedOn: '2016-06-11T19:13:27.360Z',
        enabled: true,
        preferredVersionID: 2,
        permissions: [
            {
                title: 'Edit Resources',
                id: 'EDIT_RES',
                enabled: true
            },
            {
                title: 'Edit Practices',
                id: 'EDIT_PRAC',
                enabled: false
            },
            {
                title: 'Admin',
                id: 'ADMIN',
                enabled: true
            }
        ]
    },
    {
        id: 3,
        email: 'jean@gmail.com',
        password: 'hash?',
        firstName: 'Ali',
        lastName: 'Atthemall',
        joinedOn: '2014-08-11T19:13:27.360Z',
        enabled: false,
        preferredVersionID: 14,
        permissions: [
            {
                title: 'Edit Resources',
                id: 'EDIT_RES',
                enabled: false
            },
            {
                title: 'Edit Practices',
                id: 'EDIT_PRAC',
                enabled: true
            },
            {
                title: 'Admin',
                id: 'ADMIN',
                enabled: true
            }
        ]
    },
    {
        id: 4,
        email: 'ali@gmail.com',
        password: 'hash?',
        firstName: 'Aali',
        lastName: 'Btthemall',
        joinedOn: '2011-06-11T19:13:27.360Z',
        enabled: true,
        preferredVersionID: 14,
        permissions: [
            {
                title: 'Edit Resources',
                id: 'EDIT_RES',
                enabled: true
            },
            {
                title: 'Edit Practices',
                id: 'EDIT_PRAC',
                enabled: false
            },
            {
                title: 'Admin',
                id: 'ADMIN',
                enabled: false
            }
        ]
    },
    {
        id: 5,
        email: 'jean@gmail.com',
        password: 'hash?',
        firstName: 'Bba',
        lastName: 'Btthemall',
        joinedOn: '2016-08-11T17:13:27.360Z',
        enabled: true,
        preferredVersionID: 14,
        permissions: [
            {
                title: 'Edit Resources',
                id: 'EDIT_RES',
                enabled: false
            },
            {
                title: 'Edit Practices',
                id: 'EDIT_PRAC',
                enabled: false
            },
            {
                title: 'Admin',
                id: 'ADMIN',
                enabled: true
            }
        ]
    },
    {
        id: 6,
        email: 'celeste@gmail.com',
        password: 'hash?',
        firstName: 'Celeste',
        lastName: 'Ctthemall',
        joinedOn: '2016-08-11T19:56:27.360Z',
        enabled: true,
        preferredVersionID: 14,
        permissions: [
            {
                title: 'Edit Resources',
                id: 'EDIT_RES',
                enabled: true
            },
            {
                title: 'Edit Practices',
                id: 'EDIT_PRAC',
                enabled: true
            },
            {
                title: 'Admin',
                id: 'ADMIN',
                enabled: true
            }
        ]
    },
    {
        id: 7,
        email: 'jean@gmail.com',
        password: 'hash?',
        firstName: 'Zoe',
        lastName: 'Dtthemall',
        joinedOn: '2016-08-11T19:13:27.360Z',
        enabled: true,
        preferredVersionID: 14,
        permissions: [
            {
                title: 'Edit Resources',
                id: 'EDIT_RES',
                enabled: false
            },
            {
                title: 'Edit Practices',
                id: 'EDIT_PRAC',
                enabled: false
            },
            {
                title: 'Admin',
                id: 'ADMIN',
                enabled: true
            }
        ]
    },
    {
        id: 8,
        email: 'bbdoni@gmail.com',
        password: 'hash?',
        firstName: 'Doni',
        lastName: 'Dtthemall',
        joinedOn: '2016-08-11T19:13:27.360Z',
        enabled: true,
        preferredVersionID: 14,
        permissions: [
            {
                title: 'Edit Resources',
                id: 'EDIT_RES',
                enabled: true
            },
            {
                title: 'Edit Practices',
                id: 'EDIT_PRAC',
                enabled: false
            },
            {
                title: 'Admin',
                id: 'ADMIN',
                enabled: true
            }
        ]
    },
    {
        id: 9,
        email: 'zzjean@gmail.com',
        password: 'hash?',
        firstName: 'Jean',
        lastName: 'Etthemall',
        joinedOn: '2016-08-11T19:13:27.360Z',
        enabled: true,
        preferredVersionID: 14,
        permissions: [
            {
                title: 'Edit Resources',
                id: 'EDIT_RES',
                enabled: false
            },
            {
                title: 'Edit Practices',
                id: 'EDIT_PRAC',
                enabled: true
            },
            {
                title: 'Admin',
                id: 'ADMIN',
                enabled: true
            }
        ]
    },
    {
        id: 10,
        email: 'yyajean@gmail.com',
        password: 'hash?',
        firstName: 'Jean',
        lastName: 'BBtthemall',
        joinedOn: '2016-08-11T19:13:27.360Z',
        enabled: true,
        preferredVersionID: 14,
        permissions: [
            {
                title: 'Edit Resources',
                id: 'EDIT_RES',
                enabled: false
            },
            {
                title: 'Edit Practices',
                id: 'EDIT_PRAC',
                enabled: true
            },
            {
                title: 'Admin',
                id: 'ADMIN',
                enabled: false
            }
        ]
    },
    {
        id: 11,
        email: 'lean@gmail.com',
        password: 'hash?',
        firstName: 'AAJean',
        lastName: 'Fgtthemall',
        joinedOn: '2016-08-10T19:11:27.360Z',
        enabled: true,
        preferredVersionID: 14,
        permissions: [
            {
                title: 'Edit Resources',
                id: 'EDIT_RES',
                enabled: true
            },
            {
                title: 'Edit Practices',
                id: 'EDIT_PRAC',
                enabled: false
            },
            {
                title: 'Admin',
                id: 'ADMIN',
                enabled: false
            }
        ]
    },
    {
        id: 12,
        email: 'gean@gmail.com',
        password: 'hash?',
        firstName: 'aaJean',
        lastName: 'aatthemall',
        joinedOn: '2016-08-11T19:13:27.360Z',
        enabled: true,
        preferredVersionID: 14,
        permissions: [
            {
                title: 'Edit Resources',
                id: 'EDIT_RES',
                enabled: true
            },
            {
                title: 'Edit Practices',
                id: 'EDIT_PRAC',
                enabled: true
            },
            {
                title: 'Admin',
                id: 'ADMIN',
                enabled: false
            }
        ]
    }
];

//MOCK
const PERMISSION_TYPES: Permission[] = [
    {
        title: 'Edit Resources',
        id: 'EDIT_RES',
    },
    {
        title: 'Edit Practices',
        id: 'EDIT_PRAC',
    },
    {
        title: 'Admin',
        id: 'ADMIN',
    }
];


@Injectable()
export class UserService {
    private loggedIn = false;

    constructor(private http: Http) {
        this.loggedIn = !!localStorage.getItem('id_token');
        console.log('inside the user service constructor; user logged in?');
        console.log(this.loggedIn);
    }

    login(username, password) {
        return this.http
            .post(
                baseUrl + '/sessions/create',
                JSON.stringify({username, password}),
                {headers: contentHeaders}
            )
            .map(res => res.json())
            .map((res) => {
                console.log(res);
                localStorage.setItem('id_token', res.id_token);
                this.loggedIn = true;
                return this.loggedIn;
                /* // the back-end server I'm using does not return a 'success' property....
                 if (res.success) {
                 localStorage.setItem('id_token', res.id_token);
                 this.loggedIn = true;
                 }
                 return res.success;
                 */
            });
    }

    signup(username, password) {
        return this.http
            .post(
                baseUrl + '/users',
                JSON.stringify({username, password}),
                {headers: contentHeaders}
            )
            .map(
                res => {
                    localStorage.setItem('id_token', res.json().id_token);
                    console.log(res);
                    this.loggedIn = true;
                    return res;
                })
    }

    logout() {
        localStorage.removeItem('id_token');
        this.loggedIn = false;
    }

    isLoggedIn() {
        return this.loggedIn;
    }

    getUsers() {
        let users: User[] = [];

        for (let user of USERS) {
            let userPermissions: UserPermission[] = [];
            for (let permission of user.permissions) {
                userPermissions.push(new UserPermission(
                    {
                        enabled: permission.enabled,
                        id: permission.id,
                        title: permission.title
                    }
                    )
                )
            }
            users.push(new User(
                {
                    id: user.id,
                    email: user.email,
                    password: user.password,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    joinedOn: user.joinedOn,
                    enabled: user.enabled,
                    preferredVersionID: user.preferredVersionID,
                    permissions: userPermissions
                })
            )
        }

        var promise = Promise.resolve(users);// Observable.just(USERS);
        return Observable.fromPromise(promise);
    }

    getPermissionTypes() {
        var promise = Promise.resolve(PERMISSION_TYPES);// Observable.just(USERS);
        return Observable.fromPromise(promise);
    }

    getInitialUserPermissions() {// returns an UserPermission-like dictionary with initial data; used to populate the form for creating a new user
        var initialUserPermissions = [];

        for (let permission of PERMISSION_TYPES) {
            initialUserPermissions.push({
                title: permission.title,
                id: permission.id,
                enabled: false
            });
        }

        var promise = Promise.resolve(initialUserPermissions);
        return Observable.fromPromise(promise);
    }


}
