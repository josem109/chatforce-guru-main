
import { faker } from '@faker-js/faker';

// Generate mock users
export const generateMockUsers = (count: number) => {
  const users = [];
  
  for (let i = 0; i < count; i++) {
    users.push({
      id: `user-${i}`,
      name: faker.person.fullName(),
      email: faker.internet.email(),
      status: faker.helpers.arrayElement(['active', 'inactive']) as 'active' | 'inactive'
    });
  }
  
  return users;
};

// Generate mock conversations
export const generateMockConversations = (count: number) => {
  const conversations = [];
  const users = generateMockUsers(10);
  
  const queryTemplates = [
    "¿Cuáles son las cobranzas pendientes de {cliente}?",
    "¿Cuál es el estado del pedido #{id}?",
    "¿Puedo ver el historial de pagos de {cliente}?",
    "¿Cuándo se entregará el pedido #{id}?",
    "Necesito información sobre las cobranzas de {cliente}",
    "¿Ya se procesó el pago de {cliente}?",
    "¿Cuánto falta por cobrar a {cliente}?",
    "¿Tiene deuda pendiente {cliente}?",
    "¿Se ha enviado el pedido #{id}?",
    "¿Cuál es la dirección de entrega del pedido #{id}?"
  ];
  
  const botResponseTemplates = [
    "El cliente {cliente} tiene {monto} en cobranzas pendientes con fecha de vencimiento {fecha}.",
    "El pedido #{id} está actualmente en estado '{estado}'. La fecha estimada de entrega es {fecha}.",
    "Aquí está el historial de pagos de {cliente}: {historial}",
    "El pedido #{id} está programado para entrega el {fecha} entre las {hora1} y {hora2}.",
    "El cliente {cliente} tiene {cantidad} facturas, de las cuales {pendientes} están pendientes.",
    "El pago de {cliente} por {monto} fue procesado el {fecha}.",
    "A {cliente} le falta pagar un total de {monto}. La próxima fecha de vencimiento es {fecha}.",
    "{cliente} tiene una deuda pendiente de {monto} con {dias} días de retraso.",
    "El pedido #{id} fue enviado el {fecha} por {transportista}. El número de seguimiento es {seguimiento}.",
    "La dirección de entrega del pedido #{id} es: {direccion}"
  ];
  
  for (let i = 0; i < count; i++) {
    const user = faker.helpers.arrayElement(users);
    const messageCount = faker.number.int({ min: 2, max: 15 });
    const messages = [];
    
    for (let j = 0; j < messageCount; j++) {
      const isUser = j % 2 === 0;
      let content = '';
      
      if (isUser) {
        // Generate user query
        let template = faker.helpers.arrayElement(queryTemplates);
        content = template
          .replace('{cliente}', faker.company.name())
          .replace('{id}', faker.string.numeric(5));
      } else {
        // Generate bot response
        let template = faker.helpers.arrayElement(botResponseTemplates);
        content = template
          .replace('{cliente}', faker.company.name())
          .replace('{id}', faker.string.numeric(5))
          .replace('{monto}', `$${faker.finance.amount()}`)
          .replace('{fecha}', faker.date.recent().toLocaleDateString())
          .replace('{estado}', faker.helpers.arrayElement(['En proceso', 'Enviado', 'Entregado', 'Cancelado']))
          .replace('{historial}', `${faker.finance.amount()} (${faker.date.past().toLocaleDateString()}), ${faker.finance.amount()} (${faker.date.past().toLocaleDateString()})`)
          .replace('{hora1}', `${faker.number.int({ min: 9, max: 17 })}:00`)
          .replace('{hora2}', `${faker.number.int({ min: 9, max: 17 })}:00`)
          .replace('{cantidad}', faker.number.int({ min: 1, max: 10 }).toString())
          .replace('{pendientes}', faker.number.int({ min: 1, max: 5 }).toString())
          .replace('{dias}', faker.number.int({ min: 1, max: 60 }).toString())
          .replace('{transportista}', faker.company.name())
          .replace('{seguimiento}', faker.string.alphanumeric(10).toUpperCase())
          .replace('{direccion}', `${faker.location.streetAddress()}, ${faker.location.city()}, ${faker.location.zipCode()}`);
      }
      
      const timestamp = new Date();
      timestamp.setMinutes(timestamp.getMinutes() - (messageCount - j) * faker.number.int({ min: 1, max: 10 }));
      
      messages.push({
        id: `msg-${i}-${j}`,
        content,
        isUser,
        timestamp,
        userId: user.id
      });
    }
    
    const lastMessageDate = messages[messages.length - 1].timestamp;
    
    conversations.push({
      id: `conv-${i}`,
      userId: user.id,
      userName: user.name,
      messages,
      lastMessageDate
    });
  }
  
  // Sort conversations by last message date (newest first)
  return conversations.sort((a, b) => 
    b.lastMessageDate.getTime() - a.lastMessageDate.getTime()
  );
};
