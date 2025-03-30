
// Collection of mock responses for different query types
const cobranzaResponses = [
  "Las cobranzas de este mes suman $142,380 con un incremento del 8% respecto al mes anterior. El cliente Distribuidora Norte ha realizado el mayor pago por $32,450.",
  "El total de cobranzas realizadas esta semana es de $37,890. Los clientes con pagos pendientes son: Comercial Sur ($15,600), TechSolutions ($8,900) y MercadoExpress ($12,300).",
  "Se han registrado 28 pagos este mes por un total de $98,750. La tasa de morosidad ha disminuido un 5% comparado con el mismo período del año pasado.",
  "Las cobranzas del sector retail alcanzaron $78,900 este mes, mientras que el sector industrial suma $103,450. El promedio de días para cobrar ha mejorado de 45 a 38 días.",
  "El cliente Grupo Industriales ha realizado un pago parcial de $23,400 correspondiente a la factura #F-2023-089. Queda pendiente un saldo de $12,600 con vencimiento el próximo 15."
];

const pedidoResponses = [
  "Se han registrado 425 pedidos este mes con un valor total de $623,450. El tiempo promedio de procesamiento ha sido de 3.8 días.",
  "El pedido #34567 ha sido enviado hoy y se estima una entrega en 2 días hábiles. El cliente ha sido notificado por correo electrónico.",
  "Este mes los pedidos han aumentado un 12% comparado con el mismo período del año anterior. La categoría de productos con mayor demanda es 'Electrónicos' con 143 pedidos.",
  "El pedido #45678 está en espera debido a que el producto 'Monitor UltraHD' se encuentra temporalmente sin stock. Se estima reposición en 5 días.",
  "Los últimos 10 pedidos procesados tienen un valor promedio de $2,345 por pedido. La región con mayor cantidad de pedidos es 'Centro' con 187 órdenes este mes."
];

const pedidoEspecificoResponses: Record<string, string[]> = {
  "12345": [
    "El pedido #12345 está en proceso de envío y saldrá del almacén hoy. Se espera que llegue a su destino en 3 días hábiles.",
    "El pedido #12345 incluye 5 productos y tiene un valor total de $1,890. Todos los artículos están disponibles y listos para envío.",
    "El pedido #12345 ha sido preparado y está programado para salir mañana. El cliente ha solicitado entrega prioritaria."
  ],
  "67890": [
    "El pedido #67890 está programado para envío el próximo lunes. Todos los artículos están disponibles en stock.",
    "El pedido #67890 contiene productos de las categorías 'Hogar' y 'Oficina'. El valor total es de $3,450 con descuento aplicado.",
    "El pedido #67890 está en la fase final de preparación. Se ha confirmado disponibilidad de todos los productos solicitados."
  ]
};

const defaultResponses = [
  "Puedo ayudarte con información sobre cobranzas y pedidos. Por favor, sé más específico en tu consulta o utiliza alguno de los ejemplos proporcionados.",
  "Para brindarte la información más precisa, necesito que especifiques si tu consulta es sobre cobranzas, pedidos generales o un pedido específico.",
  "¿Te gustaría obtener información sobre cobranzas recientes o el estado de algún pedido en particular? Por favor proporciona más detalles.",
  "Estoy aquí para ayudarte con datos sobre cobranzas y seguimiento de pedidos. ¿Podrías reformular tu pregunta con más detalles?",
  "No he podido identificar si tu consulta es sobre cobranzas o pedidos. ¿Podrías ser más específico para poder asistirte mejor?"
];

// Function to get a random response from an array
const getRandomResponse = (responses: string[]): string => {
  const randomIndex = Math.floor(Math.random() * responses.length);
  return responses[randomIndex];
};

// Main function to generate mock responses
export const generateMockResponse = (userQuery: string): string => {
  const query = userQuery.toLowerCase();
  
  // Check for pedido específico first
  for (const [orderNum, responses] of Object.entries(pedidoEspecificoResponses)) {
    if (query.includes(orderNum)) {
      return getRandomResponse(responses);
    }
  }
  
  // Check for general categories
  if (query.includes('cobranza') || query.includes('cobrado') || query.includes('pago')) {
    return getRandomResponse(cobranzaResponses);
  }
  
  if (query.includes('pedido') || query.includes('orden') || query.includes('envío')) {
    return getRandomResponse(pedidoResponses);
  }
  
  // Default fallback response
  return getRandomResponse(defaultResponses);
};
