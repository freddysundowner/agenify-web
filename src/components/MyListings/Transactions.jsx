import React from "react";
import BalanceCard from "../../cards/BalanceCard";

const Transactions = () => {
  const transactions = [
    {
      date: "Jun 7, 2024",
      type: "Withdrawal Fee",
      description: "Withdrawal Fee - M-Pesa xxxx-3474",
      client: "",
      amount: "-$0.99",
      refId: "702457226",
    },
    {
      date: "Jun 7, 2024",
      type: "Withdrawal",
      description: "M-Pesa transfer 28391.00 KES to xxxx-3474",
      client: "",
      amount: "-$227.08",
      refId: "702457225",
    },
    {
      date: "Jun 7, 2024",
      type: "VAT",
      description: "VAT (KE) - Service Fee - Ref ID 701123356",
      client: "Lowcoder Software LTD",
      amount: "-$4.13",
      refId: "701123397",
    },
    {
      date: "Jun 7, 2024",
      type: "Service Fee",
      description: "Service Fee for Hourly - Ref ID 701123340",
      client: "Lowcoder Software LTD",
      amount: "-$25.80",
      refId: "701123356",
    },
    {
      date: "Jun 7, 2024",
      type: "Hourly",
      description: "Invoice for 05/27/2024-06/02/2024 - 14:20 hrs @ $18.00/hr",
      client: "Lowcoder Software LTD",
      amount: "$258.00",
      refId: "701123340",
    },
    {
      date: "Jun 5, 2024",
      type: "VAT",
      description: "VAT (KE) - Membership Fee - Ref ID 702063037",
      client: "",
      amount: "-$1.92",
      refId: "702063039",
    },
    {
      date: "Jun 5, 2024",
      type: "Membership Fee",
      description: "Fees for additional Connects (80).",
      client: "",
      amount: "-$12.00",
      refId: "702063037",
    },
  ];

  return (
    <div className="overflow-x-auto">
      <BalanceCard />
      <table className="min-w-full bg-white">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-2 px-3 text-left">Date</th>
            <th className="py-2 px-3 text-left">Type</th>
            <th className="py-2 px-3 text-left">Description</th>
            <th className="py-2 px-3 text-left">Client</th>
            <th className="py-2 px-3 text-left">Amount</th>
            <th className="py-2 px-3 text-left">Ref ID</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction, index) => (
            <tr key={index} className="border-t">
              <td className="py-2 px-3">{transaction.date}</td>
              <td className="py-2 px-3">{transaction.type}</td>
              <td className="py-2 px-3">{transaction.description}</td>
              <td className="py-2 px-3">{transaction.client}</td>
              <td className="py-2 px-3">{transaction.amount}</td>
              <td className="py-2 px-3 text-green-500">{transaction.refId}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Transactions;
