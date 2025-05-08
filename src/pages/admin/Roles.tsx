import React, { useState } from "react";
import {
  PlusCircle,
  Search,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

interface Role {
  id: string;
  name: string;
  description: string;
}

const initialRoles: Role[] = [
  {
    id: "1",
    name: "Gerente",
    description: "Acceso completo al sistema",
  },
  {
    id: "2",
    name: "Agente de Cobranzas",
    description: "Gestión de cobranzas y seguimiento de pagos",
  },
  {
    id: "3",
    name: "Cliente",
    description: "Acceso limitado a sus propias transacciones",
  },
  {
    id: "4",
    name: "Vendedor",
    description: "Gestión de ventas y clientes",
  },
];

const Roles: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>(initialRoles);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddRoleOpen, setIsAddRoleOpen] = useState(false);
  const [isEditRoleOpen, setIsEditRoleOpen] = useState(false);
  const [isDeleteRoleOpen, setIsDeleteRoleOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  // Estados para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Form state
  const [formName, setFormName] = useState("");
  const [formDescription, setFormDescription] = useState("");

  // Filtered roles
  const filteredRoles = roles.filter(
    (role) =>
      role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      role.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calcular índices para paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredRoles.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredRoles.length / itemsPerPage);

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

  // Add role handler
  const handleAddRole = () => {
    setFormName("");
    setFormDescription("");
    setIsAddRoleOpen(true);
  };

  // Edit role handler
  const handleEditRole = (role: Role) => {
    setSelectedRole(role);
    setFormName(role.name);
    setFormDescription(role.description);
    setIsEditRoleOpen(true);
  };

  // Delete role handler
  const handleDeleteRole = (role: Role) => {
    setSelectedRole(role);
    setIsDeleteRoleOpen(true);
  };

  // Save add role
  const saveAddRole = () => {
    if (!formName) {
      toast({
        title: "Error",
        description: "Por favor completa el nombre del rol",
        variant: "destructive",
      });
      return;
    }

    const newRole: Role = {
      id: `role-${Date.now()}`,
      name: formName,
      description: formDescription,
    };

    setRoles((prevRoles) => [...prevRoles, newRole]);
    setIsAddRoleOpen(false);

    toast({
      title: "Rol agregado",
      description: `${formName} ha sido agregado con éxito`,
    });
  };

  // Save edit role
  const saveEditRole = () => {
    if (!selectedRole || !formName) {
      toast({
        title: "Error",
        description: "Por favor completa el nombre del rol",
        variant: "destructive",
      });
      return;
    }

    setRoles((prevRoles) =>
      prevRoles.map((role) =>
        role.id === selectedRole.id
          ? { ...role, name: formName, description: formDescription }
          : role
      )
    );

    setIsEditRoleOpen(false);

    toast({
      title: "Rol actualizado",
      description: `${formName} ha sido actualizado con éxito`,
    });
  };

  // Confirm delete role
  const confirmDeleteRole = () => {
    if (!selectedRole) return;

    setRoles((prevRoles) =>
      prevRoles.filter((role) => role.id !== selectedRole.id)
    );
    setIsDeleteRoleOpen(false);

    toast({
      title: "Rol eliminado",
      description: `${selectedRole.name} ha sido eliminado con éxito`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Gestión de Roles</h1>
        <Button onClick={handleAddRole}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Nuevo Rol
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar roles..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Roles Table */}
      <div className="glass-morphism rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Nombre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Descripción
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {currentItems.map((role) => (
                <tr
                  key={role.id}
                  className="hover:bg-secondary/20 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {role.name}
                  </td>
                  <td className="px-6 py-4 text-sm">{role.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditRole(role)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive/90"
                      onClick={() => handleDeleteRole(role)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredRoles.length === 0 && (
            <div className="py-20 text-center text-muted-foreground">
              No se encontraron roles
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
              {Math.min(indexOfLastItem, filteredRoles.length)} de{" "}
              {filteredRoles.length} registros
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
                    // Mostrar siempre la primera página, la última página,
                    // la página actual y una página antes y después de la actual
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

      {/* Add Role Dialog */}
      <Dialog open={isAddRoleOpen} onOpenChange={setIsAddRoleOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agregar nuevo rol</DialogTitle>
            <DialogDescription>
              Completa los campos para crear un nuevo rol
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Nombre del rol
              </label>
              <Input
                id="name"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="Ej: Supervisor"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Descripción
              </label>
              <Input
                id="description"
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="Describe las responsabilidades del rol"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddRoleOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={saveAddRole}>Agregar rol</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Role Dialog */}
      <Dialog open={isEditRoleOpen} onOpenChange={setIsEditRoleOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar rol</DialogTitle>
            <DialogDescription>
              Actualiza la información del rol
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="edit-name" className="text-sm font-medium">
                Nombre del rol
              </label>
              <Input
                id="edit-name"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="edit-description" className="text-sm font-medium">
                Descripción
              </label>
              <Input
                id="edit-description"
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditRoleOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={saveEditRole}>Guardar cambios</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Role Dialog */}
      <Dialog open={isDeleteRoleOpen} onOpenChange={setIsDeleteRoleOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminar rol</DialogTitle>
            <DialogDescription>
              ¿Estás seguro que deseas eliminar el rol {selectedRole?.name}?
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteRoleOpen(false)}
            >
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmDeleteRole}>
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Roles;
