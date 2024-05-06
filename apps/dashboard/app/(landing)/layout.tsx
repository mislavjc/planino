import { Navigation } from 'components/@navigation/navigation';

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div>
      <Navigation />
      <main>{children}</main>
    </div>
  );
};

export default RootLayout;
