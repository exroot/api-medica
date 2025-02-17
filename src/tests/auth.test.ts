import { AuthService } from "@modules/auth/auth.service";
import { UsuarioRepository } from "@modules/usuarios/usuarios.repository";
import { Usuario } from "@modules/usuarios/usuarios.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

jest.mock("bcryptjs");
jest.mock("jsonwebtoken");

describe("AuthService", () => {
  let authService: AuthService;
  let usuarioRepositoryMock: jest.Mocked<UsuarioRepository>;

  beforeEach(() => {
    usuarioRepositoryMock = {
      findByEmail: jest.fn(),
      create: jest.fn(),
    } as unknown as jest.Mocked<UsuarioRepository>;

    authService = new AuthService(usuarioRepositoryMock);
  });

  describe("login", () => {
    it("debería retornar un token si las credenciales son correctas", async () => {
      const usuario = {
        id: 1,
        email: "test@example.com",
        password: "hashedPassword",
      } as Usuario;
      usuarioRepositoryMock.findByEmail.mockResolvedValueOnce(usuario);
      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(true);
      (jwt.sign as jest.Mock).mockReturnValueOnce("fakeToken");

      const token = await authService.login("test@example.com", "password123");

      expect(token).toBe("fakeToken");
      expect(usuarioRepositoryMock.findByEmail).toHaveBeenCalledWith(
        "test@example.com"
      );
      expect(bcrypt.compare).toHaveBeenCalledWith(
        "password123",
        "hashedPassword"
      );
      expect(jwt.sign).toHaveBeenCalledWith(
        { id: usuario.id, email: usuario.email },
        process.env.JWT_SECRET as string,
        { expiresIn: "1h" }
      );
    });

    it("debería retornar null si el usuario no existe", async () => {
      usuarioRepositoryMock.findByEmail.mockResolvedValueOnce(null);

      const token = await authService.login(
        "nonexistent@example.com",
        "password123"
      );

      expect(token).toBeNull();
      expect(usuarioRepositoryMock.findByEmail).toHaveBeenCalledWith(
        "nonexistent@example.com"
      );
    });

    it("debería retornar null si la contraseña es incorrecta", async () => {
      const usuario = {
        id: 1,
        email: "test@example.com",
        password: "hashedPassword",
      } as Usuario;
      usuarioRepositoryMock.findByEmail.mockResolvedValueOnce(usuario);
      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(false);

      const token = await authService.login(
        "test@example.com",
        "wrongpassword"
      );

      expect(token).toBeNull();
      expect(bcrypt.compare).toHaveBeenCalledWith(
        "wrongpassword",
        "hashedPassword"
      );
    });
  });

  describe("register", () => {
    it("debería registrar un nuevo usuario con la contraseña hasheada", async () => {
      const userData = {
        email: "new@example.com",
        password: "plainPassword",
      } as Partial<Usuario>;
      const hashedPassword = "hashedPassword";
      const createdUser = {
        ...userData,
        id: 1,
        password: hashedPassword,
      } as Usuario;

      (bcrypt.hash as jest.Mock).mockResolvedValueOnce(hashedPassword);
      usuarioRepositoryMock.create.mockResolvedValueOnce(createdUser);

      const result = await authService.register(userData);

      expect(result).toEqual(createdUser);
      expect(bcrypt.hash).toHaveBeenCalledWith("plainPassword", 10);
      expect(usuarioRepositoryMock.create).toHaveBeenCalledWith({
        ...userData,
        password: hashedPassword,
      });
    });
  });
});
