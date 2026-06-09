import { useSearchParams, useNavigate } from 'react-router-dom'

export default function PaymentResultPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const orderId = searchParams.get('orderId')
  const status = searchParams.get('status')
  const isSuccess = status === 'success'

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 flex flex-col items-center justify-center p-8">
        {isSuccess ? (
          <>
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-4">
              <span className="text-4xl text-green-500">✓</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900 mb-2">Payment Successful</h1>
            <p className="text-sm text-gray-500 mb-6">Your order has been placed successfully.</p>
          </>
        ) : (
          <>
            <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mb-4">
              <span className="text-4xl text-red-500">✕</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900 mb-2">Payment Failed</h1>
            <p className="text-sm text-gray-500 mb-6">Please try again or contact support.</p>
          </>
        )}

        {orderId && (
          <p className="text-sm text-gray-400 mb-8">
            Order No: <span className="font-mono text-gray-600">#{orderId}</span>
          </p>
        )}

        <div className="flex gap-3 w-full max-w-xs">
          {orderId && (
            <button
              onClick={() => navigate(`/orders/${orderId}`)}
              className="flex-1 py-3 rounded-lg border border-blue-500 text-blue-500 font-semibold text-sm"
            >
              View Order
            </button>
          )}
          <button
            onClick={() => navigate('/')}
            className="flex-1 py-3 rounded-lg bg-blue-500 text-white font-semibold text-sm"
          >
            Back to Home
          </button>
        </div>
      </main>
    </div>
  )
}
