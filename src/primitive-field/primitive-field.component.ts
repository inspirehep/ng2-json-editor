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
  OnInit,
  Component,
  Input,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import { renderToString } from 'katex';

import { AbstractFieldComponent } from '../abstract-field';
import {
  AppGlobalsService,
  ComponentTypeService,
  JsonStoreService,
  SchemaValidationService,
  PathUtilService,
  DomUtilService,
  KatexService
} from '../shared/services';
import { JSONSchema } from '../shared/interfaces';

@Component({
  selector: 'primitive-field',
  encapsulation: ViewEncapsulation.None,
  styleUrls: [
    './primitive-field.component.scss'
  ],
  templateUrl: './primitive-field.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PrimitiveFieldComponent extends AbstractFieldComponent implements OnInit {

  @Input() schema: JSONSchema;
  @Input() path: Array<any>;
  @Input() value: string | number | boolean;

  latexPreview = '';
  latexPreviewShown = false;

  constructor(public schemaValidationService: SchemaValidationService,
    public componentTypeService: ComponentTypeService,
    public appGlobalsService: AppGlobalsService,
    public jsonStoreService: JsonStoreService,
    public pathUtilService: PathUtilService,
    public domUtilService: DomUtilService,
    public changeDetectorRef: ChangeDetectorRef,
    public katexService: KatexService
  ) {
    super(appGlobalsService, pathUtilService, changeDetectorRef);
  }

  ngOnInit() {
    if (this.schema.latexPreview) {
      this.latexPreviewShown = true;
      this.latexPreview = this.value.toString();
      setTimeout(() => {
        let el = document.getElementById(this.pathString + '-latex');
        this.katexService.renderMathInElement(el);
      });
    } else {
      this.latexPreviewShown = false;
    }
  }

  hidePreview() {
    this.latexPreviewShown = false;
  }

  commitValueChange() {
    if (this.schema.latexPreview) {
      this.latexPreview = this.value.toString();
      this.latexPreviewShown = true;
      setTimeout(() => {
        let el = document.getElementById(this.pathString + '-latex');
        this.katexService.renderMathInElement(el);
      });
    }
    this.domUtilService.clearHighlight();
    let errors = this.schemaValidationService.validateValue(this.value, this.schema);
    this.jsonStoreService.setIn(this.path, this.value);
    this.internalErrors = errors;
    this.appGlobalsService.extendInternalErrors(this.pathString, errors);
  }

  onKeypress(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      this.commitValueChange();
      event.preventDefault();
    }
  }

  onAutocompleteInputValueChange(value: string) {
    this.value = value;
  }

  onSearchableDropdownSelect(value: string) {
    this.value = value;
    this.commitValueChange();
  }

  get tabIndex(): number {
    return this.schema.disabled ? -1 : 1;
  }

  get tooltipPosition(): string {
    let tooltipPlacement = 'top';
    if (this.pathString.startsWith(this.appGlobalsService.firstElementPathForCurrentTab)) {
      tooltipPlacement = 'bottom';
    }
    return tooltipPlacement;
  }

  get disabled(): boolean {
    return this.schema.disabled && !this.appGlobalsService.adminMode;
  }

  get disabledClass(): string {
    return this.disabled ? 'disabled' : '';
  }

}
