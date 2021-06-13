import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { IUsersRepository } from "../../repositories/IUsersRepository"
import { CreateUserError } from "./CreateUserError"
import { CreateUserUseCase } from "./CreateUserUseCase"

let createUserUseCase: CreateUserUseCase
let inMemoryUserRepository: IUsersRepository

describe("Create User", () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUsersRepository()
    createUserUseCase = new CreateUserUseCase(inMemoryUserRepository)
  })

  it("should be able to create a user", async () => {
    const user = await createUserUseCase.execute({ name: "Test User", email: "test@example.com", password: "test_password" })
    expect(user).toHaveProperty("id")
  })

  it("shouldn't be able to create a user if email already exists", () => {
    expect(async () => {
      await createUserUseCase.execute({ name: "Test User", email: "test@example.com", password: "test_password" })
      await createUserUseCase.execute({ name: "Test User", email: "test@example.com", password: "test_password" })
    }).rejects.toBeInstanceOf(CreateUserError)
  })

})
