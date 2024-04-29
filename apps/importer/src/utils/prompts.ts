export const functionExtractionPrompt = (
  extractedData: unknown[][],
) => `You will be given a 2d array of data, your task is to take the data and convert it into an array of JSON objects. 
      The schema for JSON that you MUST follow is as follows, but ONLY if the data can be converted into this schema:
      <SCHEMA>
      type Item = {
        name: string,
        quantity: number,
        price: number,
        expenses: number,
      }
      </SCHEMA>

      You must return a JS function that takes the data as input and returns an array of JSON objects that follow the schema provided above. DO not add any additional fields, only the fields provided in the schema and do not change the field names.

      <IMPORTANT>
      Return the function in a SINGLE line, do not add any new lines or spaces, the function should be a single line of code.
      Use function declaration syntax, not arrow function syntax. Name it 'extractData'.
      Follow the schema provided above.
      Make sure that for e.g. 'name' field, the value is a string, for 'quantity' field, the value is a number, etc.
      </IMPORTANT>

      DO NOT return anything other than the code, no console logs, no comments, no other code.

      DO NOT explain your code, the code should be self-explanatory.

      The example of the input, the output that must be returned and a  fuction that you must write is as follows:

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

      <EXAMPLE_NEEDED_OUTPUT>
      [
        {
          name: 'ponuda pizza',
          quantity: 54000,
          price: 15,
          expenses: 6
        },
        {
          name: 'ponuda jela po narudžbi',
          quantity: 21600,
          price: 9,
          expenses: 4
        },
        {
          name: 'ponuda mesnih jela',
          quantity: 18000,
          price: 15,
          expenses: 6
        },
        {
          name: 'ponuda lazanja',
          quantity: 3600,
          price: 10.1,
          expenses: 4
        },
        {
          name: 'ponuda dodataka',
          quantity: 10800,
          price: 2,
          expenses: 1
        },
        {
          name: 'ponuda pića',
          quantity: 57600,
          price: 2.3,
          expenses: 1
        }
      ]
      </EXAMPLE_NEEDED_OUTPUT>

      <EXAMPLE_FUNCTION>
      'function extractData(data){return data.map(([name,_,quantity,price,expenses])=>({name:name?.toString(),quantity:quantity?.valueOf(),price:price?.valueOf(),expenses:expenses?.valueOf()})).filter(({name,quantity,price,expenses})=>name!==null&&quantity!==null&&price!==null&&expenses!==null)}'
      </EXAMPLE_FUNCTION>

      The data will be as follows:
      <DATA>
      ${JSON.stringify(extractedData)}
      </DATA>

      I the data cannot be converted into the schema provided, you must return a function that returns an empty array.

      Good luck!
`;
