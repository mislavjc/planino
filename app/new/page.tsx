import { OrganizationForm } from 'components/@organization/form';
import { TypographyH3 } from 'components/ui/typography';

const NewPage = () => {
  return (
    <div className="flex h-svh items-center justify-center">
      <div className="border p-8">
        <TypographyH3>Kreiraj novu organizaciju</TypographyH3>
        <OrganizationForm />
      </div>
    </div>
  );
};

export default NewPage;
