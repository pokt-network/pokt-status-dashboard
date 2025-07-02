import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ApplicationsTable } from "../tables/applications";

export function ApplicationsCard() {
  return (
    <Card className="w-full min-w-md">
      <CardHeader>
        <CardTitle>Applications</CardTitle>
      </CardHeader>
      <CardContent>
        <ApplicationsTable />
      </CardContent>
    </Card>
  );
}