export const functionExtractionPrompt = (
  extractedData: unknown[][],
) => `You will be given a 2d array of data, your task is to take the data and return an object that maps to each column inside the array. 
      The schema for JSON that you MUST follow is as follows, but ONLY if the data can be converted into this schema:
      <SCHEMA>
      const returnObj = {
        name: number,
        quantity: number,
        price: number,
        expenses: number,
      }
      </SCHEMA>

      Each field must correspond to its index.

      <IMPORTANT>
      Make sure that for e.g. 'name' field, the value is a string, for 'quantity' field, the value is a number, etc.
      </IMPORTANT>

      DO NOT return anything other than the object, no console logs, no comments, no other code.

      DO NOT explain your object, the object should be self-explanatory.

      The example of the input and the output that must be returned is as follows:

      <EXAMPLE_INPUT>
      [
        [
          null,
          'jedinica mjere',
          'Broj proizvoda',
          'Cijena',
          'Jedinični troškovi',
          'Prihod\r\neur u tis.',
          'Troškovi \r\neur u tis.',
          'CK \r\neur/tis.',
          'Bruto marža%'
        ],
        [ 'ponuda pizza', 'kom', 54000, 15, 6, 810, 324, 486, 0.6 ],
        [
            ponuda jela po narudžbi',
          'kom',
          21600,
          9,
          4,
          194.4,
          86.4,
          108,
          0.5555555555555556
        ],
        [ 'ponuda mesnih jela', 'kom', 18000, 15, 6, 270, 108, 162, 0.6 ],
        [
          'ponuda lazanja',
          'kom',
          3600,
          10.1,
          4,
          36.36,
          14.4,
          21.96,
          0.6039603960396039
        ],
        [ 'ponuda dodataka', 'kom', 10800, 2, 1, 21.6, 10.8, 10.8, 0.5 ],
        [
          'ponuda pića',
          'kom',
          57600,
          2.3,
          1,
          132.48,
          57.6,
          74.88,
          0.5652173913043478
        ],
      ],
      </EXAMPLE_INPUT>

      <EXAMPLE_RETURN>
      {
        name: 0, // Index of the 'name' in each row
        quantity: 2, // Index of the 'quantity' in each row
        price: 3, // Index of the 'price' in each row
        expenses: 4 // Index of the 'expenses' in each row
      }
      </EXAMPLE_RETURN>

      The data will be as follows:
      <DATA>
      ${JSON.stringify(extractedData)}
      </DATA>

      If the data cannot be converted into the schema provided, you must return an empty object.

      DO NOT return incorrect mappings, only return the object if you are sure that the data can be converted into the schema provided.

      Good luck!
`;

export const extractionTools = [
  {
    type: 'function' as const,
    function: {
      name: 'transformArrayToObjects',
      description:
        "Extracts data from a 2D array and returns an object mapping each column index based on specified fields. The fields in the return object are 'name', 'quantity', 'price', and 'expenses'. Each field corresponds to a specific index in each sub-array of the input. The function checks if the data can be converted into the specified schema. If not, an empty object is returned.",
      parameters: {
        type: 'object',
        properties: {
          name: {
            type: 'number',
            description:
              "The column index for the 'name' field, where the value should be a string.",
          },
          quantity: {
            type: 'number',
            description:
              "The column index for the 'quantity' field, where the value should be a number.",
          },
          price: {
            type: 'number',
            description:
              "The column index for the 'price' field, where the value should be a number.",
          },
          expenses: {
            type: 'number',
            description:
              "The column index for the 'expenses' field, where the value should be a number.",
          },
        },
        required: ['name', 'quantity', 'price', 'expenses'],
      },
    },
  },
];
