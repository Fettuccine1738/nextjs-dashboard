'use client'; // client component , which means
// you can use event listeners and hooks
import { useDebouncedCallback } from 'use-debounce';

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';

export default function Search() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = useDebouncedCallback((term: string) => {
    console.log(`Searching for:..', ${term}`);

    const params = new URLSearchParams(searchParams);
    params.set('page', '1'); // reset page to 1 when searching
     if (term) {
      params.set('query', term);
     }
     else {
      params.delete('query');
     }
     // $ pathname is current path e.g /dashboard/invoices
     // params.toString() translates user input into a url friendly format.
     // the code below updates the url with the users search data
     // without reloading the page. e.g /dashboard/invoices?query=123
     replace(`${pathname}?${params.toString()}`);
  }, 500); // run user input only after 300ms of inactivity

  return (
    <div className="relative flex flex-1 flex-shrink-0">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <input
        className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
        placeholder="Searching..."
        onChange={(e) => {
          handleSearch(e.target.value);
        }}
        defaultValue={searchParams.get('query')?.toString()}
      />
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
    </div>
  );
}
