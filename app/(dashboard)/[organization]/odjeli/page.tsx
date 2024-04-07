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
      {teams.map((team) => (
        <div key={team.teamId}>{team.name}</div>
      ))}
      <TeamsForm />
    </div>
  );
};

export default TeamsPage;
