import { auth } from 'auth';

import { db } from 'db/drizzle';

const HomePage = async () => {
  const session = await auth();

  const users = await db.query.users.findMany();

  return (
    <div>
      {session?.user?.name ? `Hello, ${session.user.name}!` : 'Hello!'}
      <h1>Page</h1>
      {users.map((user) => (
        <div key={user.id}>
          <p>{user.name}</p>
          <p>{user.email}</p>
        </div>
      ))}
    </div>
  );
};

export default HomePage;
