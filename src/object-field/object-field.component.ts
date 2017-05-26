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


import { Component, Input, OnChanges, SimpleChanges, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Map, Set } from 'immutable';
import { ReplaySubject } from 'rxjs/ReplaySubject';

import { AbstractFieldComponent } from '../abstract-field';
import { AppGlobalsService, JsonStoreService, PathUtilService, KeysStoreService } from '../shared/services';
import { JSONSchema } from '../shared/interfaces';

@Component({
  selector: 'object-field',
  styleUrls: [
    './object-field.component.scss'
  ],
  templateUrl: './object-field.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ObjectFieldComponent extends AbstractFieldComponent {

  @Input() value: Map<string, any>;
  @Input() schema: JSONSchema;
  @Input() path: Array<any>;

  constructor(public appGlobalsService: AppGlobalsService,
    public jsonStoreService: JsonStoreService,
    public pathUtilService: PathUtilService,
    public changeDetectorRef: ChangeDetectorRef,
    public keysStoreService: KeysStoreService) {
    super(appGlobalsService, pathUtilService, changeDetectorRef);
    this.appGlobalsService.adminModeSubject.subscribe(adminMode => {
      this.changeDetectorRef.markForCheck();
    });
  }

  get keys$(): ReplaySubject<Set<string>> {
    return this.keysStoreService.forPath(this.pathString);
  }

  deleteField(name: string) {
    this.jsonStoreService.removeIn(this.path);

    this.keysStoreService.deleteKey(this.pathString, name);
  }

  isDisabled(key): boolean {
    return this.schema.properties[key].disabled && !this.appGlobalsService.adminMode ;
  }
}
