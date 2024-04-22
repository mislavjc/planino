import { getTeams } from 'actions/team';

import { TeamsForm } from 'components/@teams/form';

const TeamsPage = async ({
  params: { organization },
}: {
  params: { organization: string };
}) => {
  const teams = await getTeams(organization);

  return (
    <div>
      <div className="max-w-lg">
        {teams.map((team) => (
          <div key={team.teamId} className="border p-4">
            {team.name}
          </div>
        ))}
      </div>
      <TeamsForm />
    </div>
  );
};

export default TeamsPage;
