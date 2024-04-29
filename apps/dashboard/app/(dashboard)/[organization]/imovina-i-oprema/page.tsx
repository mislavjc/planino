import { Suspense } from 'react';

import { createInventoryItem, getInventoryItems } from 'actions/inventory';

import { Card, CardContent, CardHeader } from 'ui/card';
import { ScrollArea } from 'ui/scroll-area';
import { TypographyH3 } from 'ui/typography';

import { Charts } from 'components/@inventory/charts';
import { Overview } from 'components/@inventory/overview';
import { Row } from 'components/@inventory/row';
import { AddRow } from 'components/add-row';
import { TeamInputTable } from 'components/table/team-input-table';

const InventroyAndEquipmentPage = async ({
  params,
}: {
  params: {
    organization: string;
  };
}) => {
  const teamsWithInventoryItems = await getInventoryItems(params.organization);

  return (
    <div className="flex flex-col gap-4">
      <Card className="max-w-screen-xl">
        <CardHeader>
          <TypographyH3>Imovina i oprema</TypographyH3>
        </CardHeader>
        <CardContent className="overflow-auto">
          <ScrollArea className="min-w-[40rem]">
            <TeamInputTable
              header={[
                { title: 'Naziv', width: 2 },
                { title: 'Mjesec početka' },
                { title: 'Rok amortizacije', align: 'right' },
                { title: 'Iznos', align: 'right' },
              ]}
              teams={teamsWithInventoryItems.map((team) => {
                return {
                  teamId: team.teamId,
                  name: team.name,
                  items: team.inventoryItems.map((inventoryItem) => (
                    <Row
                      key={inventoryItem.inventoryItemId}
                      inventoryItem={inventoryItem}
                    />
                  )),
                  add: (
                    <AddRow
                      action={async () => {
                        'use server';

                        await createInventoryItem({
                          organization: params.organization,
                          teamId: team.teamId,
                        });
                      }}
                    />
                  ),
                };
              })}
            />
          </ScrollArea>
        </CardContent>
      </Card>
      <Card className="max-w-screen-xl">
        <CardHeader>
          <TypographyH3>Amortizacija imovine i opreme</TypographyH3>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Suspense>
            <Charts organization={params.organization} />
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
              <Overview organization={params.organization} />
            </Suspense>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default InventroyAndEquipmentPage;
