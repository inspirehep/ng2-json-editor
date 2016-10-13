/*
 * This file is part of ng2-json-editor.
 * Copyright (C) 2016 CERN.
 *
 * ng2-json-editor is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License as
 * published by the Free Software Foundation; either version 2 of the
 * License, or (at your option) any later version.
 *
 * ng2-json-editor is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with ng2-json-editor; if not, write to the Free Software Foundation, Inc.,
 * 59 Temple Place, Suite 330, Boston, MA 02111-1307, USA.
 * In applying this license, CERN does not
 * waive the privileges and immunities granted to it by virtue of its status
 * as an Intergovernmental Organization or submit itself to any jurisdiction.
*/

import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnChanges,
  ViewEncapsulation
} from '@angular/core';
import { Http } from '@angular/http';

import { AbstractTrackerComponent } from './abstract-tracker';

import {
  AppGlobalsService,
  ComponentTypeService,
  JsonUtilService,
  RecordFixerService
} from './shared/services';

@Component({
  selector: 'json-editor',
  encapsulation: ViewEncapsulation.None,
  styleUrls: [
    './json-editor.component.scss'
  ],
  templateUrl: './json-editor.component.html'
})
export class JsonEditorComponent extends AbstractTrackerComponent implements OnChanges {

  @Input() record: Object;
  @Input() schema: Object;
  @Input() errorMap: Object = {};

  @Output() onRecordChange: EventEmitter<Object> = new EventEmitter<Object>();

  previews: Array<any> = [];

  constructor(private http: Http,
    private appGlobalsService: AppGlobalsService,
    private componentTypeService: ComponentTypeService,
    private jsonUtilService: JsonUtilService,
    private recordFixerService: RecordFixerService) {
    super();
  }

  onValueChange(event: any, key: string) {
    this.record[key] = event;
    this.onRecordChange.emit(this.record);
  }

  getFieldType(field: string): string {
    let fieldScehma = this.schema['properties'][field];
    return this.componentTypeService.getComponentType(fieldScehma);
  }

  // FIXME: called two times!
  ngOnChanges() {
    // TODO: remove this when this is called only once.
    if (Object.keys(this.record).length === 0) { return; }

    this.record = this.recordFixerService.fixRecord(this.record, this.schema);
    this.previews = this.extractPreviews();
    this.appGlobalsService.globalErrors = this.errorMap;
  }

  /**
   * Extracts previews from record using defined path in schema.
   */
  private extractPreviews(): Array<any> {
    let previews = this.schema['x_editor_previews'];
    if (previews) {
      previews.forEach(preview => {
        preview['url'] = this.jsonUtilService.getValueInPath(this.record, preview['url_path']);
      });
    }
    return previews;
  }
}
