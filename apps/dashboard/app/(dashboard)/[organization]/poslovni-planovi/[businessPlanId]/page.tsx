const BusinessPlanPage = ({
  params: { businessPlanId },
}: {
  params: {
    businessPlanId: string;
  };
}) => {
  return (
    <div>
      <h1>Business Plan {businessPlanId}</h1>
    </div>
  );
};

export default BusinessPlanPage;
