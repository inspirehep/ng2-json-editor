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

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { AbstractListFieldComponent } from '../abstract-list-field';

import {
  AppGlobalsService,
  EmptyValueService
} from '../shared/services';

@Component({
  selector: 'table-list-field',
  styleUrls: [
    './table-list-field.component.scss'
  ],
  templateUrl: './table-list-field.component.html'
})
export class TableListFieldComponent extends AbstractListFieldComponent {

  @Input() values: Array<Object>;
  @Input() schema: Object;
  @Input() path: string;

  @Output() onValuesChange: EventEmitter<Array<Object>> = new EventEmitter<Array<Object>>();

  constructor(public emptyValueService: EmptyValueService,
    public appGlobalsService: AppGlobalsService) {
    super();
  }

  /**
   * @override
   * Needs different logic! because new row supposed to
   * have same properties as the existing ones.
   * 
   * TODO: cache the emptyValue into this._emptyValue so 
   *  that this empty value will not be generated everytime
   *  but only when a new column (field) is added.
   */
  get emptyValue(): Object {
    let clone = Object.assign({}, this.values[0]);
    Object.keys(clone)
      .filter(prop => clone[prop] !== undefined)
      .forEach(prop => {
        let propSchema = this.schema['items']['properties'][prop];
        clone[prop] = this.emptyValueService.generateEmptyValue(propSchema);
      });
    return Object.assign({}, clone);
  }

}
