import OrderDetail from "@/components/home/OrderDetail";


export default function OrderDetailPage({ params }: { params: { id: string } }) {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Order Details</h1>
      <OrderDetail id={params.id} />
    </div>
  )
}

