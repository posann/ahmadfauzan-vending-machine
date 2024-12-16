import { NextRequest, NextResponse } from "next/server";

// Data mock untuk vending machine
let items = [
  { name: "Biskuit", price: 6000, stock: 10 },
  { name: "Chips", price: 8000, stock: 5 },
  { name: "Oreo", price: 10000, stock: 8 },
  { name: "Tango", price: 12000, stock: 7 },
  { name: "Cokelat", price: 15000, stock: 6 },
];

// Handle GET request
export async function GET() {
  return NextResponse.json({ items });
}

// Handle POST request
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { action, itemName, money } = body;

  if (action === "purchase") {
    const item = items.find((item) => item.name === itemName);

    if (!item) {
      return NextResponse.json({ message: "Item kosong" }, { status: 404 });
    }

    if (item.stock <= 0) {
      return NextResponse.json({ message: `${itemName} telah habis` });
    }

    if (money < item.price) {
      return NextResponse.json({
        message: `Uang anda kurang. ${itemName} seharga Rp. ${item.price}`,
      });
    }

    item.stock -= 1;
    const change = money - item.price;

    return NextResponse.json({
      message: "Pembelian berhasil, selamat menikmati",
      change,
    });
  }

  return NextResponse.json(
    { message: "Gagal, Silahkan Hubungi Tim IT Vending Machine" },
    { status: 400 }
  );
}
