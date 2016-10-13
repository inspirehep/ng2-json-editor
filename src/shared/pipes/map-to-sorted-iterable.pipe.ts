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

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'mapToSortedIterable',
  // http://stackoverflow.com/questions/34456430/ngfor-doesnt-update-data-with-pipe-in-angular2
  pure: false
})

export class MapToSortedIterablePipe implements PipeTransform {

  /**
   * Transforms an object to sorted (by `x_editor_priority`) array of key-value pairs of its properties.
   * Also it filters out the fields for which `x_editor_hidden` is set.
   * 
   * @param {Object} map - the object to be transformed
   * @param {Object} schema - the `schema.propeties` of the object, used for sorting and filtering
   * @return {Array<Pair<any>>} - sorted array of key-value pairs of given map's properties.
   */
  transform(map: Object, schema: Object): Array<Pair> {
    if (!map) { return undefined; }
    return Object.keys(map)
      .filter(key => !schema[key]['x_editor_hidden'])
      .sort((a, b) => {
        // Sort by x_editor_priority, larger is the first.
        let pa = schema[a]['x_editor_priority'] || 0;
        let pb = schema[b]['x_editor_priority'] || 0;

        if (pa > pb) { return -1; }
        if (pa < pb) { return 1; }

        // Sort alphabetically.
        if (a < b) { return -1; }
        if (a > b) { return 1; }
        return 0;
      })
      .map(key => new Pair(key, map[key]));
  }
}

// TODO: discuss if we should remove Pair and return only keys instead,
export class Pair {
  constructor(public key: string, public value: any) { }
}
