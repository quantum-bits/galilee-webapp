import { Component, OnInit, OnDestroy, ViewChild, EventEmitter, ComponentFactoryResolver } from '@angular/core';

import {PaginationInstance} from '../../../shared/interfaces/pagination-instance.interface';

import { GroupService } from '../../../shared/services/group.service';

import {EditOrganizationModalComponent} from '../edit-organization-modal';

import { EditOrganizationModalAnchorDirective } from '../edit-organization-modal-anchor.directive';
import {Organization} from '../../../shared/models/user.model';

import {MaterializeAction} from 'angular2-materialize';

import { Subscription }   from 'rxjs/Subscription';


@Component({
  selector: 'app-manage-organizations',
  templateUrl: './manage-organizations.component.html',
  styleUrls: ['./manage-organizations.component.scss']
})
export class ManageOrganizationsComponent implements OnInit, OnDestroy {

  @ViewChild(EditOrganizationModalAnchorDirective) editOrganizationModalAnchor: EditOrganizationModalAnchorDirective;

  modalActions = new EventEmitter<string|MaterializeAction>();
  subscription: Subscription;

  private modalComponent: any;

  private organizations: Organization[]; // will stay the same throughout
  filteredOrganizations: Organization[]; // the list of filtered/sorted organizations displayed on the page

  public config: PaginationInstance = {//used by pagination component
    //id: 'advanced',
    itemsPerPage: 3,
    currentPage: 1
  };

  sortableColumns = [
    {
      value: 'name',
      name: 'Organization Name'
    },
    {
      value: 'numberGroups',
      name: '# Groups'
    },
    {
      value: 'created_at',
      name: 'Joined'
    }
  ];

  private sortColumn = this.sortableColumns[0].value; // used for deciding which column to sort by; can be 'name', 'organization' or 'started'; if '', then do no sorting
  private sortAscending = true;

  public filter: string = '';//bound to textual input in template that is used for filtering the list of organizations by name, etc.


  constructor(private groupService: GroupService,
              private componentFactoryResolver: ComponentFactoryResolver) {
    this.subscription = this.groupService.closeAndCleanUpOrganizations$.subscribe(
      refreshOrganizations => {
        console.log('received word from modal...!  Refresh Organizations?', refreshOrganizations);
        this.modalCloseAndCleanUp(refreshOrganizations);
      });
  }

  ngOnInit() {
      this.fetchOrganizations();
  }

  fetchOrganizations(){
    this.groupService.getOrganizations().subscribe(
      organizations => {
        //this.permissionTypes = permissions;
        console.log('orgs: ', organizations)
        this.organizations = organizations;// not an object; Organization is just an interface

        console.log(this.organizations);

        this.refreshFilteredOrganizations();
        this.filterList();
      },
      err => console.log("ERROR", err),
      () => console.log("Organizations fetched"));
  }


  sortList() {
    //TODO: FIX THIS...!!!!



    //this.filteredGroups = this.filteredGroups.sort((n1,n2) => Group.compare(n1, n2, this.sortColumn, this.sortAscending));
  }

  refreshFilteredOrganizations() {
    this.filteredOrganizations = this.organizations.filter(organization => true);
  }


  modalCloseAndCleanUp(refreshOrganizations: boolean){
    // close the modal and then clear the viewContainer
    this.modalComponent.closeModal();
    this.editOrganizationModalAnchor.viewContainer.clear();
    if (refreshOrganizations) {
      this.fetchOrganizations();
    }
  }

  onKey(){
    //this.eventCounter+=1;
    this.filterList();
  }

  filterList(){
    if (this.filter !== '') {
      this.filteredOrganizations = this.organizations.filter(item => -1 < item.name.toLowerCase().indexOf(this.filter.toLowerCase()));
    } else {
      this.refreshFilteredOrganizations();
    }
    this.sortList();
    this.config.currentPage = 1;// need to set the current page to 1, in case the page we are on suddenly doesn't exist anymore....
  }

  toggleSort(heading: string) {
    // toggling is asc > desc > off > asc ....
    if (this.sortColumn !== heading) {//currently not sorting on any column, or sorting on a diff column
      this.sortColumn = heading;
      this.sortAscending = true;
      this.sortList();
    } else { //already sorting on this column, so toggle sort direction
      if (this.sortAscending === true) {
        this.sortAscending = false;
        this.sortList();
      } else if (this.sortAscending === false) {
        this.sortColumn = ''; //turn sorting off
      }
    }
  }

  openNewOrganizationModal() {
    this.editOrganizationModalAnchor.viewContainer.clear();
    let componentFactory = this.componentFactoryResolver.resolveComponentFactory(EditOrganizationModalComponent);
    this.modalComponent = this.editOrganizationModalAnchor.viewContainer.createComponent(componentFactory).instance;
  }

  openEditOrganizationModal(organization: Organization) {
    this.editOrganizationModalAnchor.viewContainer.clear();
    let componentFactory = this.componentFactoryResolver.resolveComponentFactory(EditOrganizationModalComponent);
    this.modalComponent = this.editOrganizationModalAnchor.viewContainer.createComponent(componentFactory).instance;
    this.modalComponent.organizationData = organization;
  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    this.subscription.unsubscribe();
  }

}
