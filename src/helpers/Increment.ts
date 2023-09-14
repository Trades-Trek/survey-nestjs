export const UserIdIncrement = (userId) => {
          return (("USR-00000000").slice(0, 12 - String((+userId.split('-')[1] + 1)).length) + (+userId.split('-')[1] + 1))
}
export const OrderIdIncrement = (orderId) => {
          return (("TT-000000000000").slice(0, 15 - String((+orderId.split('-')[1] + 1)).length) + (+orderId.split('-')[1] + 1))
}
export const InvoiceIncrement = (invoiceId) => {
          return (("INV-000000000").slice(0, 13 - String((+invoiceId.split('-')[1] + 1)).length) + (+invoiceId.split('-')[1] + 1))
}
export const SubscriptionIncrement = (subscriptionId) => {
          return (("SUB-00000000").slice(0, 12 - String((+subscriptionId.split('-')[1] + 1)).length) + (+subscriptionId.split('-')[1] + 1))
}
export const PaymentIncrement = (paymentId) => {
          return (("PYM-000000000000").slice(0, 16 - String((+paymentId.split('-')[1] + 1)).length) + (+paymentId.split('-')[1] + 1))
}

export const gameIncrement = (gameId) => {
    return (("GM-0000000").slice(0, 11 - String((+gameId.split('-')[1] + 1)).length) + (+gameId.split('-')[1] + 1))
  }

