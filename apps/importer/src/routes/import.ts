import { createRoute, z } from '@hono/zod-openapi';
import * as XLSX from 'xlsx';

import { app } from 'utils/bindings';
import { extractMultipleTables } from 'utils/importer';

const importPayloadSchema = z.object({
  content: z.string().url(),
});

const postImport = createRoute({
  method: 'post',
  tags: ['import'],
  path: '/import',
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
          schema: {
            type: 'object',
            properties: {
              success: {
                type: 'boolean',
              },
            },
          },
        },
      },
      description: 'Import data',
    },
  },
});

app.openapi(postImport, async (c) => {
  const { content } = c.req.valid('json');

  return c.json({ success: true, content });
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
  path: '/import/files',
  responses: {
    200: {
      content: {
        'application/json': {
          schema: allFilesSchema.openapi('All excel files schema'),
        },
      },
      description: 'Get all excel files',
    },
  },
});

app.openapi(getAllExcelFiles, async (c) => {
  const items = await c.env.BUCKET.list();

  return c.json(items);
});

const excelFileSchema = z.array(
  z.array(
    z.union([z.string(), z.number(), z.boolean(), z.null(), z.undefined()]),
  ),
);

const getExcelFile = createRoute({
  method: 'get',
  tags: ['import'],
  path: '/import/files/{file}',
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
          schema: {
            tables: z.array(excelFileSchema).openapi('Excel file schema'),
          },
        },
      },
      description: 'Get all excel files',
    },
  },
});

app.openapi(getExcelFile, async (c) => {
  const { file } = c.req.valid('param');

  const object = await c.env.BUCKET.get(file);

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

  const tables = extractMultipleTables(parsedExcel);

  return c.json({
    count: tables.length,
    tables,
  });
});

export type ExcelFile = z.infer<typeof excelFileSchema>;

export { app as importRoutes };
