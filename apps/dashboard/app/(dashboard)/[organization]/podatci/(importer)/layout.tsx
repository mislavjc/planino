import { Stepper } from 'components/@import/stepper';

const ImportLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="flex flex-col gap-4">
      <Stepper />
      {children}
    </div>
  );
};

export default ImportLayout;
