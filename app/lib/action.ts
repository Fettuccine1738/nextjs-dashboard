
'use server'; // use server marks all the 
// exported functions within the file as server actions
// server actions directly inside Server components by adding 
// the 'use server' directive to the top of the function.
import { z } from 'zod';
import postgres from 'postgres';
// since data is being updated, we need to clear the cache
// and trigger a new request to the server
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';


const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

const FormSchema = z.object({
    id: z.string(),
    customerId: z.string(),
    amount: z.coerce.number(),
    status: z.enum(['pending', 'paid']),
    date: z.string()
});

const CreateInvoice = FormSchema.omit({id: true, date: true});

export async function createInvoice(formData: FormData) {
    const { customerId, amount, status } = CreateInvoice.parse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });
    const amountInCents = amount * 100; // convert to cents to offset Javascript floating-point 
    // errors and greater accuracy
    const date = new Date().toISOString().split('T')[0]; // get current date in ISO format
    console.log("logging cents date", amountInCents, date);

    await sql`
        INSERT INTO invoices (customer_id, amount, status, date)
        VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
        `;
    console.log('Invoice created successfully!');
    revalidatePath('/dashboard/invoices'); // revalidate the path to clear the cache
    // redirect user back to the the invoices page
    redirect('/dashboard/invoices'); 
}

const UpdateInvoice = FormSchema.omit({id: true, date: true});

export async function updateInvoice(id: string, formData: FormData) {
    const { customerId, amount, status } = UpdateInvoice.parse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'), 
    });
    const amountInCents = amount * 100; // convert to cents to offset Javascript floating-point
    
    await sql`
        UPDATE invoices
        SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
        WHERE id = ${id}
        `;
    console.log('Invoice edited successfully!');
    revalidatePath('/dashboard/invoices'); // revalidate the path to clear the cache
    redirect('/dashboard/invoices'); // revalidate the path to clear the cache
}

export async function deleteInvoice(id: string) {
    await sql`DELETE FROM invoices WHERE id = ${id}`;
    console.log('Invoice deleted successfully!');
    // revalidate will trigger a new request to the server
    // and re-render the table
    revalidatePath('/dashboard/invoices'); // revalidate the path to clear the cache
    // redirect not needed since this action is being called
    // in the /dashboard/invoices page
    // redirect('/dashboard/invoices'); 
}
