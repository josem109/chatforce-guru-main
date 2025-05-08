import React, { useState } from "react";
import {
  Download,
  Search,
  Filter,
  Eye,
  Calendar,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { formatDistance } from "date-fns";
import { es } from "date-fns/locale";
import { generateMockConversations } from "@/lib/mockAdminData";

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  userId: string;
}

interface Conversation {
  id: string;
  userId: string;
  userName: string;
  messages: Message[];
  lastMessageDate: Date;
}

const Conversations: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>(
    generateMockConversations(20)
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [userFilter, setUserFilter] = useState("all");
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);

  // Estados para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Get unique user IDs for filter
  const uniqueUsers = Array.from(
    new Set(conversations.map((conv) => conv.userId))
  );

  // Filtered conversations
  const filteredConversations = conversations.filter((conversation) => {
    const matchesSearch =
      conversation.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conversation.messages.some((msg) =>
        msg.content.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesUser =
      userFilter === "all" || conversation.userId === userFilter;

    return matchesSearch && matchesUser;
  });

  // Calcular índices para paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredConversations.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredConversations.length / itemsPerPage);

  // Función para cambiar de página
  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // Función para ir a la página anterior
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Función para ir a la página siguiente
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // View conversation detail
  const handleViewDetail = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    setIsDetailOpen(true);
  };

  // Export conversations as JSON
  const handleExport = () => {
    try {
      const dataToExport = filteredConversations.map((conv) => ({
        id: conv.id,
        userId: conv.userId,
        userName: conv.userName,
        messages: conv.messages.map((msg) => ({
          content: msg.content,
          isUser: msg.isUser,
          timestamp: msg.timestamp,
        })),
      }));

      const jsonString = JSON.stringify(dataToExport, null, 2);
      const blob = new Blob([jsonString], { type: "application/json" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `chatforce-conversations-${
        new Date().toISOString().split("T")[0]
      }.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Exportación exitosa",
        description: `Se han exportado ${filteredConversations.length} conversaciones`,
      });
    } catch (error) {
      console.error("Error exporting conversations:", error);
      toast({
        title: "Error",
        description: "No se pudieron exportar las conversaciones",
        variant: "destructive",
      });
    }
  };

  // Get last message preview
  const getLastMessagePreview = (conversation: Conversation) => {
    if (conversation.messages.length === 0) return "";

    const lastMessage = conversation.messages[conversation.messages.length - 1];
    const prefix = lastMessage.isUser ? "Usuario: " : "Bot: ";
    const content =
      lastMessage.content.length > 60
        ? `${lastMessage.content.substring(0, 60)}...`
        : lastMessage.content;

    return `${prefix}${content}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Registro de Conversaciones</h1>
        <Button onClick={handleExport}>
          <Download className="h-4 w-4 mr-2" />
          Exportar
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por usuario o contenido..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Select value={userFilter} onValueChange={setUserFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Usuario" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los usuarios</SelectItem>
            {uniqueUsers.map((userId) => {
              const userName = conversations.find(
                (c) => c.userId === userId
              )?.userName;
              return (
                <SelectItem key={userId} value={userId}>
                  {userName}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>

      {/* Conversations List */}
      <div className="glass-morphism rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Usuario
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Último mensaje
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Mensajes
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {currentItems.map((conversation) => (
                <tr
                  key={conversation.id}
                  className="hover:bg-secondary/20 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {conversation.userName}
                  </td>
                  <td className="px-6 py-4 text-sm max-w-xs">
                    <div className="truncate">
                      {getLastMessagePreview(conversation)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-2" />
                      {formatDistance(
                        conversation.lastMessageDate,
                        new Date(),
                        {
                          addSuffix: true,
                          locale: es,
                        }
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {conversation.messages.length}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewDetail(conversation)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Ver
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredConversations.length === 0 && (
            <div className="py-20 text-center text-muted-foreground">
              No se encontraron conversaciones
            </div>
          )}
        </div>

        {/* Paginación */}
        <div className="py-4 px-6 border-t border-border/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Mostrar</span>
            <Select
              value={itemsPerPage.toString()}
              onValueChange={(value) => {
                setItemsPerPage(Number(value));
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-[70px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-sm text-muted-foreground">por página</span>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-sm text-muted-foreground">
              Mostrando {indexOfFirstItem + 1} a{" "}
              {Math.min(indexOfLastItem, filteredConversations.length)} de{" "}
              {filteredConversations.length} registros
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              {/* Botones de página */}
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((page) => {
                    return (
                      page === 1 ||
                      page === totalPages ||
                      Math.abs(page - currentPage) <= 1
                    );
                  })
                  .map((page, index, array) => (
                    <React.Fragment key={page}>
                      {index > 0 && array[index - 1] !== page - 1 && (
                        <span className="px-2 text-muted-foreground">...</span>
                      )}
                      <Button
                        variant={currentPage === page ? "default" : "outline"}
                        size="icon"
                        onClick={() => paginate(page)}
                      >
                        {page}
                      </Button>
                    </React.Fragment>
                  ))}
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Conversation Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              Conversación con {selectedConversation?.userName}
            </DialogTitle>
            <DialogDescription>
              Total de mensajes: {selectedConversation?.messages.length}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 max-h-[60vh] overflow-y-auto chat-container scrollbar-thin pr-2">
            {selectedConversation?.messages.map((message, index) => (
              <div
                key={index}
                className={`mb-4 flex ${
                  message.isUser ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.isUser
                      ? "bg-chat-user text-chat-user-foreground rounded-tr-none"
                      : "glass-morphism bg-chat-bot text-chat-bot-foreground rounded-tl-none"
                  }`}
                >
                  <div className="mb-1">{message.content}</div>
                  <div
                    className={`text-xs ${
                      message.isUser
                        ? "text-chat-user-foreground/70 text-right"
                        : "text-chat-bot-foreground/70"
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString("es-ES", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailOpen(false)}>
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Conversations;
