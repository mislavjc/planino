export const ExcelTableCell = ({
  children,
  backgroundColor,
}: {
  children?: React.ReactNode;
  backgroundColor: string;
}) => {
  return (
    <div
      className="h-6 truncate border border-gray-300 p-1 font-mono text-xs"
      style={{
        backgroundColor,
      }}
    >
      {children}
    </div>
  );
};
