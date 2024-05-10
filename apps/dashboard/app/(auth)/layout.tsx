import Image from 'next/image';

const AuthLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="bg-muted grid min-h-screen place-items-center">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-center gap-2">
          <Image src="/icon.png" alt="Planino" width={24} height={24} />
          <h1 className="text-xl font-semibold">Planino</h1>
        </div>
        <div className="flex items-center justify-center border bg-white p-24">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
