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

import { fromJS } from 'immutable';
import 'rxjs/add/operator/skip';
import 'rxjs/add/operator/take';

import { JsonStoreService } from './json-store.service';
import { PathUtilService } from './path-util.service';
import { KeysStoreService } from './keys-store.service';

class MockKeysStoreService extends KeysStoreService {
  buildKeysMapRecursivelyForPath(map: any, path: any) { }
  syncKeysForPath(path: any, json: any) { }
}

describe('JsonStoreService', () => {

  let service: JsonStoreService;

  beforeEach(() => {
    service = new JsonStoreService(new PathUtilService(), new MockKeysStoreService(null, null, null, null));
  });

  it('should get notSetValue if path is not in json', () => {
    const json = fromJS({
      whatever: {}
    });
    service.setJson(json);

    const result = service.getIn(['thing'], 'defaultValue');
    expect(result).toEqual('defaultValue');
  });

  it('should set in path and notify when some lists parents is missing', () => {
    const json = fromJS({
      aMap: {}
    });
    service.setJson(json);

    const path = ['aMap', 'aList', 0, 'innerList', 0, 'innerProperty'];
    const value = 'value';
    const expected = fromJS({
      aMap: {
        aList: [
          {
            innerList: [
              { innerProperty: value }
            ]
          }
        ]
      }
    });

    service.json$.subscribe(changedJson => {
      // expect(immutable1).toEqual(immutable2) doesn't work as expected
      expect(changedJson.equals(expected)).toBeTruthy();
    });

    service.setIn(path, value);
  });

  it('should set in path and notify when some map parents are missing', () => {
    const json = fromJS({
      aMap: {}
    });
    service.setJson(json);

    const path = ['aMap', 'anotherMap', 'innerMap', 'innerProperty'];
    const value = 'value';
    const expected = fromJS({
      aMap: {
        anotherMap: {
          innerMap: {
            innerProperty: value
          }
        }
      }
    });

    service.json$.subscribe(changedJson => {
      // expect(immutable1).toEqual(immutable2) doesn't work as expected
      expect(changedJson.equals(expected)).toBeTruthy();
    });

    service.setIn(path, value);
  });


  it('should insert a new element if addIn path is to an array index', () => {
    const json = fromJS({
      aMap: {
        aList: ['val1', 'val2', 'val3']
      }
    });
    service.setJson(json);

    const path = ['aMap', 'aList', 1];
    const value = 'toBeInsertedAt1';
    const expected = fromJS({
      aMap: {
        aList: ['val1', 'toBeInsertedAt1', 'val2', 'val3']
      }
    });

    service.json$.subscribe(changedJson => {
      expect(changedJson.equals(expected)).toBeTruthy();
    });

    service.addIn(path, value);
  });

  it('should append a new element if addIn path is to the -', () => {
    const json = fromJS({
      aMap: {
        aList: ['val1', 'val2', 'val3']
      }
    });
    service.setJson(json);

    const path = ['aMap', 'aList', '-'];
    const value = 'toBeAppended';
    const expected = fromJS({
      aMap: {
        aList: ['val1', 'val2', 'val3', 'toBeAppended']
      }
    });

    service.json$.subscribe(changedJson => {
      expect(changedJson.equals(expected)).toBeTruthy();
    });

    service.addIn(path, value);
  });

  it('should removeIn if setIn value is empty string', () => {
    const json = fromJS({
      foo: 'bar'
    });
    const path = ['foo'];
    service.setJson(json);
    spyOn(service, 'removeIn');
    service.setIn(path, '');
    expect(service.removeIn).toHaveBeenCalledWith(path);
  });

  it('should add new field if addIn path is to an object property', () => {
    const json = fromJS({
      aMap: {}
    });
    service.setJson(json);
    const value = 'value';
    const path = ['aMap', 'aProp'];
    const expected = fromJS({
      aMap: {
        aProp: 'value'
      }
    });

    service.json$.subscribe(changedJson => {
      expect(changedJson.equals(expected)).toBeTruthy();
    });

    service.addIn(path, value);
  });

  it('should addIn an object', () => {
    const json = fromJS({
      aList: []
    });
    service.setJson(json);

    const value = {
      foo: 'bar'
    };
    const path = ['aList', '-'];
    const expected = fromJS({
      aList: [
        { foo: 'bar' }
      ]
    });
    service.json$.subscribe(changedJson => {
      expect(changedJson.equals(expected)).toBeTruthy();
    });

    service.addIn(path, value);
  });

  it('should setIn an array', () => {
    const json = fromJS({
      aMap: {}
    });
    service.setJson(json);

    const value = [1];
    const path = ['aMap', 'aList'];
    const expected = fromJS({
      aMap: {
        aList: [1]
      }
    });
    service.json$.subscribe(changedJson => {
      expect(changedJson.equals(expected)).toBeTruthy();
    });

    service.setIn(path, value);
  });

  it('should apply patch and remove it after', () => {
    const json = fromJS({
      aMap: {
        aValue: 'value'
      }
    });
    const patch = {
      op: 'replace',
      path: '/aMap/aValue',
      value: 'patchValue'
    };
    service.setJson(json);
    service.setJsonPatches([patch]);
    service.jsonPatches$.subscribe(jsonPatches => {
      expect(jsonPatches).toEqual([]);
    });
    service.json$.subscribe(changedJson => {
      expect(changedJson.getIn(['aMap', 'aValue'])).toEqual('patchValue');
    });
    // skip first because replay subject emits the result before applyPatch
    service.patchesByPath$.skip(1)
      .subscribe(patchesByPath => {
        expect(patchesByPath[patch.path]).toEqual([]);
      });
    service.applyPatch(patch);
  });

  it('should reject patch and remove it after', () => {
    const json = fromJS({
      aMap: {
        aValue: 'value'
      }
    });
    const patch = {
      op: 'replace',
      path: '/aMap/aValue',
      value: 'patchValue'
    };
    service.setJson(json);
    service.setJsonPatches([patch]);
    service.jsonPatches$.subscribe(jsonPatches => {
      expect(jsonPatches).toEqual([]);
    });
    service.json$.subscribe(changedJson => {
      expect(changedJson.getIn(['aMap', 'aValue'])).toEqual('value');
    });
    // skip first because replay subject emits the result before applyPatch
    service.patchesByPath$.skip(1)
      .subscribe(patchesByPath => {
        expect(patchesByPath[patch.path]).toEqual([]);
      });
    service.rejectPatch(patch);
  });

  it('should push to histroy for root change and rollback it', () => {
    const json = fromJS({
      aMap: {
        aValue: 'oldValue'
      }
    });
    const change = fromJS({ aValue: 'newValue', anotherValue: 'anotherValue' });
    service.setJson(json);
    service.json$.take(1)
      .subscribe(changedJson => {
        expect(changedJson.getIn(['aMap']).toJS()).toEqual(change.toJS());
      });
    service.json$.skip(1)
      .subscribe(changedJson => {
        expect(changedJson.getIn(['aMap']).toJS()).toEqual({ aValue: 'oldValue' });
      });
    service.setIn(['aMap'], change);
    service.rollbackLastChange();
  });

  it('should set json patches and group them by path', () => {
    const patches = [
      {
        path: '/p/1',
        op: 'replace',
        value: 'value1'
      },
      {
        path: '/p/1',
        op: 'replace',
        value: 'value2'
      },
      {
        path: '/p/2',
        op: 'remove'
      }
    ];
    const expectedPatchesByPath = {
      '/p/1': [
        {
          path: '/p/1',
          op: 'replace',
          value: 'value1'
        },
        {
          path: '/p/1',
          op: 'replace',
          value: 'value2'
        }
      ],
      '/p/2': [
        {
          path: '/p/2',
          op: 'remove'
        }
      ]
    };
    service.patchesByPath$
      .subscribe(patchesByPath => {
        expect(patchesByPath).toEqual(expectedPatchesByPath);
      });
    service.setJsonPatches(patches);
  });

  it('should return true for parent if a child has a patch', () => {
    const patches = [
      {
        path: '/parent/children/0',
        op: 'replace',
        value: 'child-value'
      },
      {
        path: '/other/thing',
        op: 'remove'
      }
    ];
    service.setJsonPatches(patches);
    expect(service.hasPatchOrChildrenHavePatch('/parent')).toBe(true);
  });

  it('should return true for parent if it has a patch', () => {
    const patches = [
      {
        path: '/parent',
        op: 'replace',
        value: 'parent-value'
      },
      {
        path: '/other/thing',
        op: 'remove'
      }
    ];
    service.setJsonPatches(patches);
    expect(service.hasPatchOrChildrenHavePatch('/parent')).toBe(true);
  });

  it('should return false for parent if it or a child does not have a patch', () => {
    const patches = [
      {
        path: '/other/thing',
        op: 'remove'
      }
    ];
    service.setJsonPatches(patches);
    expect(service.hasPatchOrChildrenHavePatch('/parent')).toBe(false);
  });

  it('should return false if patch is undefiled', () => {
    const patches = undefined;
    service.setJsonPatches(patches);
    expect(service.hasPatchOrChildrenHavePatch('/parent')).toBe(false);
  });
});
