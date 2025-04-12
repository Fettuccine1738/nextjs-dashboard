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
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';


const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

const FormSchema = z.object({
    id: z.string(),
    customerId: z.string({
        invalid_type_error: 'Please select a customer.',
    }),
    amount: z.coerce.number()
    .gt(0, { message: 'Amount must be greater than 0.' }),
    status: z.enum(['pending', 'paid'], {
        invalid_type_error: 'Please select a status.',
    }),
    date: z.string()
});

export type State = {
    errors?: {
        customerId?: string[];
        amount?: string[];
        status?: string[];
    }
    message?: string | null;
};

const CreateInvoice = FormSchema.omit({id: true, date: true});

export async function createInvoice(prevState: State, formData: FormData) {
    const validatedFields = CreateInvoice.safeParse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Create Invoice.',
        }
    }
    const { customerId, amount, status } = validatedFields.data;

    const amountInCents = amount * 100; // convert to cents to offset Javascript floating-point 
    // errors and greater accuracy
    const date = new Date().toISOString().split('T')[0]; // get current date in ISO format
    console.log("logging cents date", amountInCents, date);

    try {
        await sql`
        INSERT INTO invoices (customer_id, amount, status, date)
        VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
        `;
    }
    catch (error) {
        // We'll log the error to the console for debugging purposes
        console.error('Error creating invoice:', error);
    }
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
    try {
        await sql`
        UPDATE invoices
        SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
        WHERE id = ${id}
        `;
    }
    catch (error) {
        // We'll log the error to the console for debugging purposes
        console.error('Error updating invoice:', error);
    }   
    console.log('Invoice edited successfully!');
    revalidatePath('/dashboard/invoices'); // revalidate the path to clear the cache
    redirect('/dashboard/invoices'); // revalidate the path to clear the cache
}

export async function deleteInvoice(id: string) {
 //  throw new Error('Delete action not implemented yet!');
    try {
        await sql`DELETE FROM invoices WHERE id = ${id}`;
    }
    catch (error) {
        // We'll log the error to the console for debugging purposes
        console.error('Error deleting invoice:', error);
    }   
    console.log('Invoice deleted successfully!');
    // revalidate will trigger a new request to the server
    // and re-render the table
    revalidatePath('/dashboard/invoices'); // revalidate the path to clear the cache
    // redirect not needed since this action is being called
    // in the /dashboard/invoices page
    // redirect('/dashboard/invoices'); 
}

export async function authenticate (
    prevState: string | undefined,
    formData: FormData,
) {
    try {
        await signIn('credentials', formData);
    }
    catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':   
                    return 'Invalid credentials. Please try again.';
                default:
                    return 'An unknown error occurred. Please try again.';
            }
        }
        throw error;
    }
}