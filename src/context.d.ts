/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * The context thingie.
 */
export interface Context {
  /**
   * An error message that has been generated during pipeline processing
   */
  error?: string;
  content?: {
    /**
     * List of URIs that have been retrieved for this piece of content
     */
    sources?: string[];
  };
}
