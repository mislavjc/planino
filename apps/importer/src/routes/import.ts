import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { createRoute, z } from '@hono/zod-openapi';
import { generateText, tool } from 'ai';
import * as XLSX from 'xlsx';

import { app, getOpenAIClient, getR2Client } from 'utils/bindings';
import {
  extractMultipleTableCoordinates,
  extractTableFromCoordinates,
  getTransformerFunction,
} from 'utils/importer';
import { functionExtractionPrompt } from 'utils/prompts';

const importPayloadSchema = z.object({
  names: z.array(z.string()).min(1),
});

const postImport = createRoute({
  method: 'post',
  tags: ['import'],
  path: '/import/presigned-url',
  request: {
    body: {
      content: {
        'application/json': {
          schema: importPayloadSchema.openapi('Import data payload schema'),
        },
      },
      required: true,
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z
            .object({
              urls: z.record(z.string()),
            })
            .openapi({
              title: 'Presigned URLs',
            }),
        },
      },
      description: 'Get presigned URLs for importing data',
    },
  },
});

app.openapi(postImport, async (c) => {
  const { names } = c.req.valid('json');

  const r2Client = getR2Client(c.env);
  const urls: Record<string, string> = {};
  for (const name of names) {
    const url = await getSignedUrl(
      r2Client,
      new PutObjectCommand({
        Bucket: c.env.R2_BUCKET_NAME,
        Key: name,
      }),
      {
        expiresIn: 3600,
      },
    );

    urls[name] = url;
  }

  return c.json({ urls });
});

const allFilesSchema = z.object({
  objects: z.array(
    z.object({
      key: z.string(),
      size: z.number(),
    }),
  ),
  truncated: z.boolean(),
  delimitedPrefixes: z.array(z.string()),
});

const getAllExcelFiles = createRoute({
  method: 'get',
  tags: ['import'],
  path: '/import/{organization}/files',
  request: {
    params: z
      .object({
        organization: z.string(),
      })
      .openapi({
        param: {
          name: 'organization',
          in: 'path',
        },
      }),
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: allFilesSchema.openapi('All excel files schema'),
        },
      },
      description: 'Get all excel files from organization bucket',
    },
  },
});

app.openapi(getAllExcelFiles, async (c) => {
  const { organization } = c.req.valid('param');

  const items = await c.env.BUCKET.list({
    prefix: organization + '/',
  });

  return c.json(items);
});

const baseCellSchema = z.union([z.string(), z.number(), z.boolean(), z.null()]);

const excelFileSchema = z.array(
  z.array(z.union([baseCellSchema, z.undefined()])),
);

const coordinatesSchema = z.object({
  startRow: z.number(),
  startColumn: z.number(),
  endRow: z.number(),
  endColumn: z.number(),
});

export type Coordinates = z.infer<typeof coordinatesSchema>;

const getExcelFile = createRoute({
  method: 'get',
  tags: ['import'],
  path: '/import/{file}/coordinates',
  request: {
    params: z
      .object({
        file: z.string(),
      })
      .openapi({
        param: {
          name: 'file',
          in: 'path',
        },
      }),
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z
            .object({
              worksheet: z.array(z.array(baseCellSchema)),
              tables: z.array(
                z.object({
                  coordinates: coordinatesSchema,
                }),
              ),
            })
            .openapi({
              title: 'Excel file table coordinates',
            }),
        },
      },
      description: 'Get all table coordinates from excel file',
    },
    404: {
      content: {
        'application/json': {
          schema: z
            .object({
              error: z.string(),
            })
            .openapi({
              title: 'File not found',
            }),
        },
      },
      description: 'File not found',
    },
  },
});

app.openapi(getExcelFile, async (c) => {
  const { file } = c.req.valid('param');

  const key = decodeURIComponent(file);

  const object = await c.env.BUCKET.get(key);

  const objectData = await object?.arrayBuffer();

  if (!objectData) {
    return c.json({ error: 'File not found' }, { status: 404 });
  }

  const workbook = XLSX.read(objectData);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const excel = XLSX.utils.sheet_to_json(worksheet, {
    header: 1,
    blankrows: true,
  });

  const parsedExcel = excelFileSchema.parse(excel);

  const tables = extractMultipleTableCoordinates(parsedExcel);

  return c.json({
    worksheet: excel,
    tables,
  });
});

export type ExcelFile = z.infer<typeof excelFileSchema>;

const extractionSchema = z.array(
  z.record(z.string(), z.union([z.string(), z.number(), z.null()])),
);

const extractDataFromCoordinates = createRoute({
  method: 'post',
  tags: ['import'],
  path: '/import/extract-data',
  request: {
    body: {
      content: {
        'application/json': {
          schema: z
            .object({
              worksheet: z.array(z.array(baseCellSchema)),
              coordinates: coordinatesSchema,
            })
            .openapi({
              title: 'Extract data from coordinates',
            }),
        },
      },
      required: true,
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z
            .object({
              data: extractionSchema,
            })
            .openapi({
              title: 'Extracted data',
            }),
        },
      },
      description: 'Extract data from coordinates',
    },
    400: {
      content: {
        'application/json': {
          schema: z
            .object({
              error: z.string(),
            })
            .openapi({
              title: 'Error',
            }),
        },
      },
      description: 'Error extracting data',
    },
  },
});

app.openapi(extractDataFromCoordinates, async (c) => {
  const { worksheet, coordinates } = c.req.valid('json');

  const messages = [];

  const extractedData = extractTableFromCoordinates(worksheet, coordinates);

  const transformArrayToObjects = getTransformerFunction(extractedData);

  const slicedData = extractedData.slice(0, 5);

  const openai = getOpenAIClient(c.env);

  const result = await generateText({
    model: openai('gpt-4o'),
    temperature: 0,
    messages: [
      {
        role: 'system',
        content: functionExtractionPrompt(slicedData),
      },
    ],
    tools: {
      transformArrayToObjects: tool({
        description:
          "Extracts data from a 2D array and returns an object mapping each column index based on specified fields. The fields in the return object are 'name', 'quantity', 'price', and 'expenses'. Each field corresponds to a specific index in each sub-array of the input. The function checks if the data can be converted into the specified schema. If not, an empty object is returned.",
        parameters: z.object({
          name: z
            .number()
            .describe(
              "The column index for the 'name' field, where the value should be a string.",
            ),
          quantity: z
            .number()
            .describe(
              "The column index for the 'quantity' field, where the value should be a number.",
            ),
          price: z
            .number()
            .describe(
              "The column index for the 'price' field, where the value should be a number.",
            ),
          expenses: z
            .number()
            .describe(
              "The column index for the 'expenses' field, where the value should be a number.",
            ),
        }),
        execute: async (args) => transformArrayToObjects(args),
      }),
    },
  });

  messages.push(result);

  const parsedData = extractionSchema.parse(result.toolResults[0]?.result);

  return c.json({ data: parsedData });
});

export { app as importRoutes };
