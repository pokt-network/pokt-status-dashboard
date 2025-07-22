import { StatusTable } from "../tables/status";

export function StatusCard() {
  return (
    <div className="w-full min-w-md p-0 gap-1 border-none bg-none flex flex-col">
      <div className="rounded-lg p-4 text-white bg-[#09279f] mb-0">
        <div className="flex flex-row justify-between items-center gap-4">
          <h1 className="text-white text-2xl font-bold">Status</h1>
        </div>
      </div>
      <div className="mt-4">
        <StatusTable />
      </div>
    </div>
  );
}