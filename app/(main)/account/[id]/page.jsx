import { Suspense } from "react";
import { getAccountWithTransactions } from "@/actions/account";
import { BarLoader } from "react-spinners";
import { TransactionTable } from "../_components/transaction-table";
import { AccountChart } from "../_components/account-chart";
import Link from "next/link";

export default async function AccountPage({ params }) {
  // Check if ID is provided
  if (!params.id) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-4xl font-bold">No Account Selected</h1>
        <p className="text-muted-foreground mt-2">Please select an account to view details.</p>
        <Link href="/account" className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Go to Account List
        </Link>
      </div>
    );
  }

  const accountData = await getAccountWithTransactions(params.id);

  if (!accountData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-4xl font-bold">Account Not Found</h1>
        <p className="text-muted-foreground mt-2">The account does not exist.</p>
        <Link href="/account" className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Go to Account List
        </Link>
      </div>
    );
  }

  const { transactions, ...account } = accountData;

  return (
    <div className="space-y-8 px-5">
      <div className="flex gap-4 items-end justify-between">
        <div>
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight gradient-title capitalize">
            {account.name}
          </h1>
          <p className="text-muted-foreground">
            {account.type.charAt(0) + account.type.slice(1).toLowerCase()}{" "}
            Account
          </p>
        </div>

        <div className="text-right pb-2">
          <div className="text-xl sm:text-2xl font-bold">
            ₹{parseFloat(account.balance).toFixed(2)}
          </div>
          <p className="text-sm text-muted-foreground">
            {account._count.transactions} Transactions
          </p>
        </div>
      </div>

      {/* Chart Section */}
      <Suspense fallback={<BarLoader className="mt-4" width={"100%"} color="#9333ea" />}>
        <AccountChart transactions={transactions} />
      </Suspense>

      {/* Transactions Table */}
      <Suspense fallback={<BarLoader className="mt-4" width={"100%"} color="#9333ea" />}>
        <TransactionTable transactions={transactions} />
      </Suspense>
    </div>
  );
}
