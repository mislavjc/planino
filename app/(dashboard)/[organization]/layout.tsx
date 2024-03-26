import { getOrganization } from 'actions/organization';

export const runtime = 'edge';

const OrganizationLayout = async ({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: {
    organization: string;
  };
}>) => {
  const organization = await getOrganization(params.organization);

  return (
    <div>
      <header>
        <h1>{organization.name}</h1>
      </header>
      <main>{children}</main>
    </div>
  );
};

export default OrganizationLayout;
