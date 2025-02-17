import { UsuarioService } from "@modules/usuarios/usuarios.service";
import { UsuarioRepository } from "@modules/usuarios/usuarios.repository";
import { Usuario } from "@modules/usuarios/usuarios.model";

describe("UsuarioService", () => {
  let usuarioService: UsuarioService;
  let usuarioRepositoryMock: jest.Mocked<UsuarioRepository>;

  beforeEach(() => {
    // Mock del repositorio de usuarios
    usuarioRepositoryMock = {
      findById: jest.fn(),
      findByEmail: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<UsuarioRepository>;

    // Instanciamos el servicio con los mocks
    usuarioService = new UsuarioService(usuarioRepositoryMock);
  });

  it("debería obtener el perfil de un usuario existente", async () => {
    const usuario = { id: 1, email: "test@example.com" } as Usuario;
    usuarioRepositoryMock.findById.mockResolvedValueOnce(usuario);

    const result = await usuarioService.getProfile(1);

    expect(result).toEqual(usuario);
    expect(usuarioRepositoryMock.findById).toHaveBeenCalledWith(1);
  });

  it("debería retornar null si el usuario no existe", async () => {
    usuarioRepositoryMock.findById.mockResolvedValueOnce(null);

    const result = await usuarioService.getProfile(999);

    expect(result).toBeNull();
    expect(usuarioRepositoryMock.findById).toHaveBeenCalledWith(999);
  });

  it("debería validar si un usuario existe", async () => {
    const usuario = { id: 1, email: "test@example.com" } as Usuario;
    usuarioRepositoryMock.findById.mockResolvedValueOnce(usuario);

    const result = await usuarioService.validarUsuarioExiste(1);

    expect(result).toEqual(usuario);
    expect(usuarioRepositoryMock.findById).toHaveBeenCalledWith(1);
  });

  it("debería lanzar un error si el usuario no existe", async () => {
    usuarioRepositoryMock.findById.mockResolvedValueOnce(null);

    await expect(usuarioService.validarUsuarioExiste(999)).rejects.toThrow(
      "Usuario no encontrado"
    );
  });

  it("debería actualizar un usuario correctamente", async () => {
    const usuarioActualizado = {
      id: 1,
      email: "updated@example.com",
    } as Usuario;
    usuarioRepositoryMock.update.mockResolvedValueOnce(usuarioActualizado);

    const result = await usuarioService.update(1, {
      email: "updated@example.com",
    });

    expect(result).toEqual(usuarioActualizado);
    expect(usuarioRepositoryMock.update).toHaveBeenCalledWith(1, {
      email: "updated@example.com",
    });
  });

  it("debería eliminar un usuario correctamente", async () => {
    usuarioRepositoryMock.delete.mockResolvedValueOnce(true);

    const result = await usuarioService.delete(1);

    expect(result).toBe(true);
    expect(usuarioRepositoryMock.delete).toHaveBeenCalledWith(1);
  });

  it("debería retornar false si no se pudo eliminar el usuario", async () => {
    usuarioRepositoryMock.delete.mockResolvedValueOnce(false);

    const result = await usuarioService.delete(999);

    expect(result).toBe(false);
    expect(usuarioRepositoryMock.delete).toHaveBeenCalledWith(999);
  });
});
