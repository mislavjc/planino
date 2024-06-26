/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */

export interface paths {
  '/import/presigned-url': {
    post: {
      requestBody: {
        content: {
          'application/json': components['schemas']['Import data payload schema'];
        };
      };
      responses: {
        /** @description Get presigned URLs for importing data */
        200: {
          content: {
            'application/json': {
              urls: {
                [key: string]: string;
              };
            };
          };
        };
      };
    };
  };
  '/import/{organization}/files': {
    get: {
      parameters: {
        path: {
          organization: string;
        };
      };
      responses: {
        /** @description Get all excel files from organization bucket */
        200: {
          content: {
            'application/json': components['schemas']['All excel files schema'];
          };
        };
      };
    };
  };
  '/import/{file}/coordinates': {
    post: {
      parameters: {
        path: {
          file: string;
        };
      };
      responses: {
        /** @description Get all table coordinates from excel file */
        200: {
          content: {
            'application/json': {
              worksheet: unknown[][];
              tables: {
                coordinates: {
                  startRow: number;
                  startColumn: number;
                  endRow: number;
                  endColumn: number;
                };
              }[];
            };
          };
        };
        /** @description File not found */
        404: {
          content: {
            'application/json': {
              error: string;
            };
          };
        };
      };
    };
  };
}

export type webhooks = Record<string, never>;

export interface components {
  schemas: {
    'Import data payload schema': {
      names: string[];
    };
    'All excel files schema': {
      objects: {
        key: string;
        size: number;
      }[];
      truncated: boolean;
      delimitedPrefixes: string[];
    };
  };
  responses: never;
  parameters: {};
  requestBodies: never;
  headers: never;
  pathItems: never;
}

export type $defs = Record<string, never>;

export type external = Record<string, never>;

export type operations = Record<string, never>;
