
import { fetchRevenue } from '@/app/lib/data';

export default async function TestPage() {
  const revenue = await fetchRevenue();

  return (
    <div>
      <h1>Revenue Data</h1>
      <pre>{JSON.stringify(revenue, null, 2)}</pre>
    </div>
  );
}