/**
 * Razorpay Payment Integration
 * 
 * In production, order creation should happen server-side.
 * This client-side integration is for testing/demo purposes.
 */

export function initiateRazorpayPayment({
  amount,        // in rupees (will be converted to paise)
  currency = 'INR',
  orderId,
  customerName = '',
  customerEmail = '',
  customerPhone = '',
  onSuccess,
  onFailure,
}) {
  const options = {
    key: import.meta.env.VITE_RAZORPAY_KEY || 'rzp_test_XXXXXXXXX',
    amount: amount * 100, // Razorpay expects paise
    currency,
    name: 'ChhumChhum',
    description: 'Fashion Label — Order Payment',
    image: '',
    order_id: orderId || undefined,
    prefill: {
      name: customerName,
      email: customerEmail,
      contact: customerPhone,
    },
    theme: {
      color: '#c9a96e',
    },
    handler: function (response) {
      if (onSuccess) {
        onSuccess({
          paymentId: response.razorpay_payment_id,
          orderId: response.razorpay_order_id,
          signature: response.razorpay_signature,
        });
      }
    },
    modal: {
      ondismiss: function () {
        if (onFailure) {
          onFailure({ reason: 'Payment cancelled by user' });
        }
      },
    },
  };

  try {
    const rzp = new window.Razorpay(options);
    rzp.on('payment.failed', function (response) {
      if (onFailure) {
        onFailure({
          reason: response.error.description,
          code: response.error.code,
        });
      }
    });
    rzp.open();
  } catch (err) {
    if (onFailure) {
      onFailure({ reason: 'Failed to initialize Razorpay: ' + err.message });
    }
  }
}
