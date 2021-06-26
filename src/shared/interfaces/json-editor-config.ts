import { PreviewConfig } from './preview-config';
import { SchemaOptions } from './schema-options';
import { CustomShortcutKeys } from './custom-shortcut-keys';
import { TabsConfig } from './tabs-config';
import { CustomFormatValidation } from './custom-format-validation';

// HACK for docs
import '../../rxjs-operators';

export interface JsonEditorConfig {
  /**
   * If set, displays the switch that can enable admin mode where any field can be edited.
   *
   * - It is `false` by default.
   */
  enableAdminModeSwitch?: boolean;

  /**
   * Max depth for tree menu
   *
   * - It is `infinity` by default
   * - Must be set to 1 or greater.
   */
  menuMaxDepth?: number;

  /**
   * Configurations for properties defined in the schema.
   * It has the same structure of schema for only fields that will be configured.
   * Example:
   * ```
   * {
   *   properties: {
   *     prop1: {
   *        ...SchemaOption...
   *     },
   *     prop1993: {
   *       items: {
   *         ...SchemaOption...,
   *         properties: {
   *           elementProp7: {
   *             ...SchemaOption...
   *           }
   *         }
   *       }
   *     }
   *   }
   * }
   * ```
   */
  schemaOptions?: SchemaOptions;

  /**
   * If set, it hides the preview section of the editor.
   *
   * - It is `false` by default.
   */
  isPreviewerHiddenOnStart?: boolean;

  /**
   * Configuration for previews to be displayed in previewer (on the right side).
   */
  previews?: Array<PreviewConfig>;

  /**
   * Configuration for the shortcuts.
   */
  shortcuts?: CustomShortcutKeys;

  /**
   * Configuration for custom tabs to group top level properties.
   */
  tabsConfig?: TabsConfig;

  /**
   * Configuration for custom formats schema validation.
   */
  customFormatValidation?: CustomFormatValidation;

  /**
   * Removes left content tree menu and bottom console.
   */
  compact?: boolean;
}
