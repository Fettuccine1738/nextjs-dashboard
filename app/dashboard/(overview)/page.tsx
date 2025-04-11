import { Card } from '@/app/ui/dashboard/cards';
import RevenueChart from '@/app/ui/dashboard/revenue-chart';
import LatestInvoices from '@/app/ui/dashboard/latest-invoices';
import { lusitana } from '@/app/ui/fonts';
// import { fetchRevenue, fetchLatestInvoices } from '@/app/lib/data'; 
import { fetchCardData } from '@/app/lib/data';
import { Suspense } from 'react';
import { LatestInvoicesSkeleton, RevenueChartSkeleton, CardsSkeleton} from '@/app/ui/skeletons';
 import  CardWrapper  from '@/app/ui/dashboard/cards';


/*
this page is an async server component, that allows to use await to 
fetch data. 3 components receive data, <Card>, <RevenueChart>, and <LatestInvoices>.
*/
export default async function Page() {
   // const revenue = await fetchRevenue();
    // const latestInvoices = await fetchLatestInvoices();
    //console.log('Revenue data:', revenue);
    //console.log('INvoices data:', latestInvoices);
    // console.log('Card data:', numberOfCustomers, numberOfInvoices, totalPaidInvoices, totalPendingInvoices);

    return (
        <main>
            <h1 className={`$lusitana.className} mb-4 text-xl md:text-2xl`}>
                Dashboard
            </h1>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Suspense fallback={<CardsSkeleton />}> 
              <CardWrapper />
             </Suspense>
            </div>
                       <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
             <Suspense fallback={<RevenueChartSkeleton />}>
             <RevenueChart />
             </Suspense>
             {/*<RevenueChart revenue={revenue}  />  */}
             <Suspense fallback={<LatestInvoicesSkeleton />}>
             <LatestInvoices />
             </Suspense>
        {/*<LatestInvoices latestInvoices={latestInvoices} > */}
        </div>
        </main>
    );
    // return <p>Dashboard Page</p>
}

 //<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                //<Card title="Collected" value={totalPaidInvoices} type="collected" /> 
     //<Card title="Pending" value={totalPendingInvoices} type="pending" /> 
     //<Card title="Total Invoices" value={numberOfInvoices} type="invoices" /> 
     //<Card
          //title="Total Customers"
          //value={numberOfCustomers}
          //type="customers"
        ///> 
                //</div>
//