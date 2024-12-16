"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

interface Item {
  name: string;
  price: number;
  stock: number;
}

interface ApiResponse {
  items: Item[];
  message?: string;
  change?: number;
}

export default function Home() {
  const [items, setItems] = useState<Item[]>([]);
  const [money, setMoney] = useState<number>(0);
  const [selectedItem, setSelectedItem] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    fetch("/api/vending-machine")
      .then((res) => res.json())
      .then((data: ApiResponse) => setItems(data.items))
      .catch((err) => console.error(err));
  }, []);

  const handlePurchase = () => {
    fetch("/api/vending-machine", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "purchase",
        itemName: selectedItem,
        money,
      }),
    })
      .then((res) => res.json())
      .then((data: ApiResponse) => {
        if (data.message) {
          setMessage(data.message);
        }
        if (data.change !== undefined) {
          setMessage(`Pembelian berhasil. Kembalian anda: ${data.change}`);
        }
        // Refresh items list
        return fetch("/api/vending-machine")
          .then((res) => res.json())
          .then((data: ApiResponse) => setItems(data.items));
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="mx-auto flex flex-col gap-4 p-4 items-center min-h-screen mt-4 w-full md:w-1/3">
      <h1 className="font-bold text-3xl">Vending Machine</h1>
      <div className="flex flex-col gap-2 w-full">
        <h2 className="font-bold">Items</h2>
        <ul className="list-disc">
          {items.map((item) => (
            <li className="ml-4" key={item.name}>
              {item.name} - Rp. {item.price} (Stock: {item.stock})
            </li>
          ))}
        </ul>
      </div>
      <div className="flex flex-col gap-2 w-full">
        <h2 className="font-bold">Pembayaran</h2>
        <select
          value={selectedItem}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full px-2 py-4 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          onChange={(e) => setSelectedItem(e.target.value)}
        >
          <option value="">Pilih Item</option>
          {items.map((item) => (
            <option key={item.name} value={item.name}>
              {item.name}
            </option>
          ))}
        </select>
        <input
          type="text"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Masukkan Uang Disini (Rp)"
          value={money === 0 ? "" : money} // Kosongkan jika 0
          onChange={(e) => {
            const input = e.target.value;
            if (/^\d*$/.test(input)) {
              setMoney(Number(input));
            }
          }}
        />
        <button
          className="mt-3 py-2.5 w-full px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
          onClick={handlePurchase}
        >
          Bayar
        </button>
      </div>
      <div className="w-full mt-2">{message && <p>{message}</p>}</div>
    </div>
  );
}
