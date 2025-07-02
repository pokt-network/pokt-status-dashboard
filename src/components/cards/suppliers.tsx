import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { SuppliersTable } from "../tables/suppliers";

export function SuppliersCard() {
  return (
    <Card className="w-full min-w-md">
      <CardHeader>
        <CardTitle>Suppliers</CardTitle>
      </CardHeader>
      <CardContent>
        <SuppliersTable />
      </CardContent>
    </Card>
  );
}