import { auth } from 'auth';

export default async function Page() {
  const session = await auth();

  return (
    <div>
      {session?.user?.name ? `Hello, ${session.user.name}!` : 'Hello!'}
      <h1>Page</h1>
    </div>
  );
}
