import { getOrganization } from 'actions/organization';

const OrganizationPage = async ({
  params,
}: {
  params: {
    organization: string;
  };
}) => {
  const organization = await getOrganization(params.organization);

  return (
    <div>
      <pre>{JSON.stringify(organization, null, 2)}</pre>
    </div>
  );
};

export default OrganizationPage;
