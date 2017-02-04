import {Component, Input, Output, EventEmitter, OnInit} from '@angular/core';

import {Tag} from "../../shared/interfaces/tag.interface";

@Component({
  selector: 'tag-picker',
  templateUrl: './tag-picker.component.html'
})
export class TagPickerComponent implements OnInit {
  @Input() selectedTags: Array<Tag> = [];
  @Input() allTags: Array<Tag> = [];
  @Output() onUpdate: EventEmitter<Array<Tag>> = new EventEmitter();

  private deselectedTags: Array<Tag> = [];

  ngOnInit() {
    // Put any tag that isn't in selectedTags into deselectedTags.
    this.allTags.forEach(aTag => {
      if (!this.selectedTags.find(sTag => sTag.id === aTag.id)) {
        this.deselectedTags.push(aTag);
      }
    });
  }

  private emit() {
    this.onUpdate.emit(this.selectedTags);
  }

  private lexSort() {
    function compare(a, b) {
      if (a.label < b.label) {
        return -1;
      } else if (a.label > b.label) {
        return 1;
      } else {
        return 0;
      }
    }
    this.selectedTags.sort(compare);
    this.deselectedTags.sort(compare);
  }

  selectTag(index: number) {
    let elt: Array<Tag> = this.deselectedTags.splice(index, 1);
    this.selectedTags.push(elt[0]);
    this.lexSort();
    this.emit();
  }

  deselectTag(index: number) {
    let elt: Array<Tag> = this.selectedTags.splice(index, 1);
    this.deselectedTags.push(elt[0]);
    this.lexSort();
    this.emit();
  }

  onNewTag(label: string) {
    this.selectedTags.push({
      id: -1,     // Negative value tells server that this is a new tag.
      label: label
    });
    this.emit();
  }
}
