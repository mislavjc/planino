import { importer } from 'api/importer/client';

const DataPage = async () => {
  const { data, error } = await importer.GET('/import/{file}/coordinates', {
    params: {
      path: {
        file: 'five.xlsx',
      },
    },
  });

  if (error) {
    throw new Error(error.error);
  }

  return (
    <div>
      <h1>Organization Data</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default DataPage;
