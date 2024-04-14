import { createInventoryItem, getInventoryItems } from 'actions/inventory';

import { Card, CardContent, CardHeader } from 'ui/card';
import { ScrollArea } from 'ui/scroll-area';
import { TypographyH3, TypographyP } from 'ui/typography';

import { Row } from 'components/@inventory/row';
import { AddRow } from 'components/add-row';

const InventroyAndEquipmentPage = async ({
  params,
}: {
  params: {
    organization: string;
  };
}) => {
  const teamsWithInventoryItems = await getInventoryItems(params.organization);

  return (
    <div>
      <Card className="max-w-screen-xl">
        <CardHeader>
          <TypographyH3>Imovina i oprema</TypographyH3>
        </CardHeader>
        <CardContent>
          <ScrollArea className="min-w-[40rem]">
            <div>
              <div className="grid grid-cols-5 text-sm">
                <TypographyP className="col-span-2">Naziv</TypographyP>
                <TypographyP>Mjesec početka</TypographyP>
                <TypographyP className="text-right">
                  Rok amortizacije
                </TypographyP>
                <TypographyP className="text-right">Iznos</TypographyP>
              </div>
              <div className="flex flex-col gap-4">
                {teamsWithInventoryItems.map((team) => (
                  <div key={team.teamId}>
                    <div className="bg-muted px-4 py-2 font-mono text-sm uppercase">
                      {team.name}
                    </div>
                    {team.inventoryItems.map((inventoryItem) => (
                      <div key={inventoryItem.inventoryItemId}>
                        <Row inventoryItem={inventoryItem} />
                      </div>
                    ))}
                    <AddRow
                      action={async () => {
                        'use server';

                        await createInventoryItem({
                          organization: params.organization,
                          teamId: team.teamId,
                        });
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default InventroyAndEquipmentPage;
