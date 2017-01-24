import { AppGlobalsService } from './app-globals.service';
import { RemoteAutocompletionService } from './remote-autocompletion.service';
import { ComponentTypeService } from './component-type.service';
import { DomUtilService } from './dom-util.service';
import { DynamicTemplateLoaderService } from './dynamic-template-loader.service';
import { EmptyValueService } from './empty-value.service';
import { JsonStoreService } from './json-store.service';
import { JsonUtilService } from './json-util.service';
import { RecordFixerService } from './record-fixer.service';
import { SchemaFixerService } from './schema-fixer.service';
import { SchemaValidationService } from './schema-validation.service';
import { WindowHrefService } from './window-href.service';
import { HookService } from './hook.service';

export {
  AppGlobalsService,
  RemoteAutocompletionService,
  ComponentTypeService,
  DomUtilService,
  DynamicTemplateLoaderService,
  EmptyValueService,
  JsonStoreService,
  JsonUtilService,
  RecordFixerService,
  SchemaFixerService,
  SchemaValidationService,
  WindowHrefService,
  HookService
};

export const SHARED_SERVICES = [
  AppGlobalsService,
  RemoteAutocompletionService,
  ComponentTypeService,
  DomUtilService,
  DynamicTemplateLoaderService,
  EmptyValueService,
  JsonStoreService,
  JsonUtilService,
  RecordFixerService,
  SchemaFixerService,
  SchemaValidationService,
  WindowHrefService,
  HookService
];
