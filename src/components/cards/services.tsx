import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ServicesTable } from "../tables/services";

export function ServicesCard() {
  return (
    <Card className="w-full min-w-md">
      <CardHeader>
        <CardTitle>Services</CardTitle>
      </CardHeader>
      <CardContent>
        <ServicesTable />
      </CardContent>
    </Card>
  );
}