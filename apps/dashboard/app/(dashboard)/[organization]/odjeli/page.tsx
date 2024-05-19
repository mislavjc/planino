import { Suspense } from 'react';

import {
  createMember,
  createTeam,
  getTeams,
  updateTeamName,
} from 'actions/team';

import { Charts } from 'components/@teams/charts';
import { Overview } from 'components/@teams/overview';
import { Row } from 'components/@teams/row';
import { AddRow } from 'components/add-row';
import { TeamInputTable } from 'components/table/team-input-table';
import { Card, CardContent, CardHeader } from 'components/ui/card';
import { ScrollArea, ScrollBar } from 'components/ui/scroll-area';
import { TypographyH3 } from 'components/ui/typography';

const TeamsPage = async ({
  params: { organization },
}: {
  params: { organization: string };
}) => {
  const teams = await getTeams(organization);

  return (
    <div className="flex flex-col gap-4">
      <Card className="max-w-screen-xl">
        <CardHeader>
          <TypographyH3>Odjeli</TypographyH3>
        </CardHeader>
        <CardContent className="overflow-auto">
          <ScrollArea className="min-w-[40rem]">
            <TeamInputTable
              header={[
                { title: 'Naziv', width: 2 },
                { title: 'Rola' },
                { title: 'Mjesec početka obračuna' },
                { title: 'Mjesec kraja obračuna' },
                { title: 'Plaća', align: 'right' },
                { title: 'Postotak rasta g/g', align: 'right' },
              ]}
              onHeaderChange={async ({ id, value }) => {
                'use server';

                await updateTeamName({
                  teamId: id,
                  name: value,
                });
              }}
              headerPlaceholder="Naziv odjela..."
              teams={teams.map((team) => {
                return {
                  teamId: team.teamId,
                  name: team.name || '',
                  items: team.members.map((member) => (
                    <Row
                      key={`${member.memberId}-${member.updatedAt}`}
                      member={member}
                    />
                  )),
                  add: (
                    <AddRow
                      action={async () => {
                        'use server';

                        await createMember({
                          organization,
                          teamId: team.teamId,
                        });
                      }}
                    />
                  ),
                };
              })}
            />
            <AddRow
              action={async () => {
                'use server';

                await createTeam(organization);
              }}
              className="mt-4"
            >
              Dodaj odjel
            </AddRow>
            <ScrollBar />
          </ScrollArea>
        </CardContent>
      </Card>
      <Card className="max-w-screen-xl">
        <CardHeader>
          <TypographyH3>Amortizacija imovine i opreme</TypographyH3>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Suspense>
            <Charts organization={organization} />
          </Suspense>
        </CardContent>
      </Card>
      <Card className="max-w-screen-xl">
        <CardHeader>
          <TypographyH3>Godišnje vrijednosti</TypographyH3>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <ScrollArea className="w-max">
            <Suspense fallback={null}>
              <Overview organization={organization} />
            </Suspense>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeamsPage;
