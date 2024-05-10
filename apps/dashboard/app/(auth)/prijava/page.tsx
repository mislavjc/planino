import { signIn } from 'auth';
import Image from 'next/image';
import Link from 'next/link';

import { Button } from 'ui/button';

import GoogleSvg from 'public/google.svg';

const Login = () => {
  return (
    <div className="mx-auto grid w-[350px] gap-6">
      <div className="grid gap-2 text-center">
        <h1 className="text-3xl">Prijavi se</h1>
      </div>
      <form
        action={async () => {
          'use server';
          await signIn('google');
        }}
      >
        <Button variant="outline" className="flex w-full items-center gap-2">
          <Image src={GoogleSvg} alt="Google" width={16} height={16} />
          Prijavi se s Googleom
        </Button>
      </form>
      <div className="mt-4 text-center text-sm">
        Nemate račun?{' '}
        <Link href="/registracija" className="underline">
          Registriraj se
        </Link>
      </div>
    </div>
  );
};

export default Login;
