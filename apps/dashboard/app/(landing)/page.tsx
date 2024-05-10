import { Features } from 'components/@homepage/features';
import { Hero } from 'components/@homepage/hero';

const HomePage = async () => {
  return (
    <div className="flex flex-col gap-20">
      <div className="mx-auto flex max-w-screen-lg flex-col gap-4 px-4">
        <Hero />
      </div>
      <div className="bg-muted/40 py-16 px-4">
        <div className="mx-auto max-w-screen-lg">
          <Features />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
