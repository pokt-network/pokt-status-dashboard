import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { GatewaysTable } from "../tables/gateways";

export function GatewaysCard() {
  return (
    <Card className="w-full min-w-md">
      <CardHeader>
        <CardTitle>Gateways</CardTitle>
      </CardHeader>
      <CardContent>
        <GatewaysTable />
      </CardContent>
    </Card>
  );
}