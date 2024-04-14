import { createInventoryItem, getInventoryItems } from 'actions/inventory';

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
      <h1>Imovina i oprema</h1>
      <div>
        {teamsWithInventoryItems.map((team) => (
          <div key={team.teamId}>
            <h2>{team.name}</h2>
            <ul>
              {team.inventoryItems.map((inventoryItem) => (
                <li key={inventoryItem.inventoryItemId}>
                  {inventoryItem.name} item
                </li>
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
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InventroyAndEquipmentPage;
