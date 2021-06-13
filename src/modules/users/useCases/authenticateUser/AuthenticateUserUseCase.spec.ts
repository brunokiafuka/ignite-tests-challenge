import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { IUsersRepository } from "../../repositories/IUsersRepository"
import { CreateUserUseCase } from "../createUser/CreateUserUseCase"
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase"
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError"


let authUserUseCase: AuthenticateUserUseCase
let createUserUseCase: CreateUserUseCase
let inMemoryUserRepository: IUsersRepository

describe("AuthenticateUserUseCase.spec", () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUsersRepository()
    createUserUseCase = new CreateUserUseCase(inMemoryUserRepository)
    authUserUseCase = new AuthenticateUserUseCase(inMemoryUserRepository)
  })

  it("should be able authenticate user", async () => {
    await createUserUseCase.execute({ name: "Test User", email: "test@example.com", password: "test_password" })

    const authUser = await authUserUseCase.execute({ email: "test@example.com", password: "test_password" })

    expect(authUser).toHaveProperty("token")
  })

  it("shouldn't be able authenticate user with wrong email", async () => {
    expect(async () => {
      await createUserUseCase.execute({ name: "Test User", email: "test@example.com", password: "test_password" })

      await authUserUseCase.execute({ email: "test1@example.com", password: "test_password" })

    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
  })

  it("shouldn't be able authenticate user with wrong password", async () => {
    expect(async () => {
      await createUserUseCase.execute({ name: "Test User", email: "test@example.com", password: "test_password" })

      await authUserUseCase.execute({ email: "test@example.com", password: "12345" })

    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
  })

})
