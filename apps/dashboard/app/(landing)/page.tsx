import { Hero } from 'components/@homepage/hero';

const HomePage = async () => {
  return (
    <div className="mx-auto flex max-w-screen-lg flex-col gap-4 px-4">
      <Hero />
    </div>
  );
};

export default HomePage;
