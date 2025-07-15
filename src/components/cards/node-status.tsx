import { Card, CardContent } from "../ui/card";
import { NodeStatusTable } from "../tables/node-status";

export function NodeStatusCard() {
  return (
    <div className="w-full min-w-md p-0 gap-1 border-none bg-none flex flex-col">
      <div className="rounded-lg p-4 text-white bg-primary mb-0">
        <div className="flex flex-row justify-between items-center gap-4">
          <h1 className="text-white text-2xl font-bold">Node Status</h1>
        </div>
      </div>
      <Card className="w-full min-w-md p-0 gap-1 border-none bg-none">
        <CardContent className="border-gray-200 border-2 p-4 rounded-lg">
          <NodeStatusTable />
        </CardContent>
      </Card>
    </div>
  );
}