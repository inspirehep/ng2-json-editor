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
  Input,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';

import { IDiffResult } from 'diff';

import { TextDiffService } from '../shared/services';
/**
 * This component has dummy html but a logic to change the value of another part
 * in top level json when its value changed. It's inserted in component tree
 * just before the actual field, so that it can detect its change and
 * run the call-back function
 */
@Component({
  selector: 'text-diff',
  templateUrl: './text-diff.component.html',
  styleUrls: [
    './text-diff.component.scss'
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TextDiffComponent {

  @Input() newText: string;
  @Input() currentText: string;

  constructor(public textDiffService: TextDiffService) { }

  get diffs(): Array<IDiffResult> {
    return this.textDiffService
      .diffByWord(this.currentText, this.newText);
  }

}
