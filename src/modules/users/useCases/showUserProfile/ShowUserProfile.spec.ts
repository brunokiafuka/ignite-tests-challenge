import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { IUsersRepository } from "../../repositories/IUsersRepository"
import { CreateUserUseCase } from "../createUser/CreateUserUseCase"
import { ShowUserProfileError } from "./ShowUserProfileError"
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase"

let showUserProfileUseCase: ShowUserProfileUseCase
let createUserUseCase: CreateUserUseCase
let inMemoryUserRepository: IUsersRepository

describe("ShowUserProfile", () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUsersRepository()
    createUserUseCase = new CreateUserUseCase(inMemoryUserRepository)
    showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUserRepository)
  })

  it("should be able to show user profile", async () => {
    const newUser = await createUserUseCase.execute({ name: "Test User", email: "test@example.com", password: "test_password" })

    const user = await showUserProfileUseCase.execute(newUser?.id ?? "")

    expect(user.id).toBe(newUser?.id)
  })

  it("shouldn't be able to show user profile if user id doesn't exist", async () => {

    expect(async () => {
      await showUserProfileUseCase.execute("1234")
    }).rejects.toBeInstanceOf(ShowUserProfileError)
  })

})
