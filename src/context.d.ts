/*
  * Copyright 2018 Adobe. All rights reserved.
  * This file is licensed to you under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License. You may obtain a copy
  * of the License at http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software distributed under
  * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
  * OF ANY KIND, either express or implied. See the License for the specific language
  * governing permissions and limitations under the License.
  */

/**
 * The context thingie.
 */
export interface Context {
  /**
   * An error message that has been generated during pipeline processing
   */
  error?: string;
  /**
   * The HTTP Request
   */
  request?: {};
  content?: Content;
  response?: Response;
}
/**
 * The content as retrieved from the repository and enriched in the pipeline.
 */
export interface Content {
  /**
   * List of URIs that have been retrieved for this piece of content
   */
  sources?: string[];
  /**
   * The content body of the retrieved source document
   */
  body?: string;
  /**
   * A node in the Markdown AST
   */
  mdast?: {
    /**
     * The node type of the MDAST node
     */
    type?: "root" | "paragraph" | "text";
    children?: {
      [k: string]: any;
    }[];
    /**
     * Marks the position of the node in the original text flow
     */
    position?: {
      /**
       * A position in a text document
       */
      start?: {
        /**
         * Line number
         */
        line?: number;
        /**
         * Column number
         */
        column?: number;
        /**
         * Character in the entire document
         */
        offset?: number;
      };
      /**
       * A position in a text document
       */
      end?: {
        /**
         * Line number
         */
        line?: number;
        /**
         * Column number
         */
        column?: number;
        /**
         * Character in the entire document
         */
        offset?: number;
      };
      indent?: any[];
    };
    /**
     * The string value of the node, if it is a terminal node.
     */
    value?: string;
    [k: string]: any;
  };
  /**
   * The extracted sections of the document
   */
  sections?: {
    /**
     * The node type of the MDAST node
     */
    type?: "root" | "paragraph" | "text";
    children?: {
      [k: string]: any;
    }[];
    /**
     * Marks the position of the node in the original text flow
     */
    position?: {
      /**
       * A position in a text document
       */
      start?: {
        /**
         * Line number
         */
        line?: number;
        /**
         * Column number
         */
        column?: number;
        /**
         * Character in the entire document
         */
        offset?: number;
      };
      /**
       * A position in a text document
       */
      end?: {
        /**
         * Line number
         */
        line?: number;
        /**
         * Column number
         */
        column?: number;
        /**
         * Character in the entire document
         */
        offset?: number;
      };
      indent?: any[];
    };
    /**
     * The string value of the node, if it is a terminal node.
     */
    value?: string;
    [k: string]: any;
  }[];
  /**
   * Extracted metadata fron the frontmatter of the document
   */
  meta?: {
    [k: string]: any;
  };
  /**
   * Extracted title of the document
   */
  title?: string;
  /**
   * Extracted first paragraph of the document
   */
  intro?: string;
  /**
   * Path (can be relative) to the first image in the document
   */
  image?: string;
  /**
   * The DOM-compatible representation of the document's inner HTML
   */
  document?: {
    [k: string]: any;
  };
  /**
   * Deprecated: the Hypermedia (HAST) AST
   */
  htast?: {
    [k: string]: any;
  };
  /**
   * Deprecated: the main HTML elements of the document. `document.children[].innerHTML` instead.
   */
  children?: string[];
  /**
   * Deprecated: the main HTML of the document. Use `document.innerHTML` instead.
   */
  html?: string;
}
/**
 * The HTTP response object
 */
export interface Response {
  /**
   * The HTTP status code
   */
  status?: number;
  body?: {
    [k: string]: any;
  };
  /**
   * The HTTP headers of the response
   */
  headers?: {
    [k: string]: string;
  };
}
