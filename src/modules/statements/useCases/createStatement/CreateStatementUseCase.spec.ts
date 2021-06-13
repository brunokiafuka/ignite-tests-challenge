import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { IUsersRepository } from "../../../users/repositories/IUsersRepository"
import { OperationType } from "../../entities/Statement"
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { IStatementsRepository } from "../../repositories/IStatementsRepository"
import { CreateStatementError } from "./CreateStatementError"
import { CreateStatementUseCase } from "./CreateStatementUseCase"


let createStatementUseCase: CreateStatementUseCase
let inMemoryUserRepository: IUsersRepository
let inMemoryStatementsRepository: IStatementsRepository


describe('Create Statement', () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUsersRepository()
    inMemoryStatementsRepository = new InMemoryStatementsRepository()
    createStatementUseCase = new CreateStatementUseCase(inMemoryUserRepository, inMemoryStatementsRepository)
  }
  )

  it('should be able to create a deposit statement', async () => {
    const user = await inMemoryUserRepository.create({ name: "Test User", email: "test@example.com", password: "test_password" })

    const deposit = await createStatementUseCase.execute({ user_id: (user.id as string), type: OperationType.DEPOSIT, amount: 100, description: "more cash" })

    expect(deposit).toHaveProperty("id")
    expect(deposit.amount).toBe(100)
  })

  it('should be able to create a withdraw', async () => {
    const user = await inMemoryUserRepository.create({ name: "Test User", email: "test@example.com", password: "test_password" })

    await createStatementUseCase.execute({ user_id: (user.id as string), type: OperationType.DEPOSIT, amount: 100, description: "more cash" })
    const withdraw = await createStatementUseCase.execute({ user_id: (user.id as string), type: OperationType.WITHDRAW, amount: 50, description: "more cash" })

    expect(withdraw).toHaveProperty("id")
    expect(withdraw.amount).toBe(50)
  })


  it("should not be able to make statement if user doesn't exist", async () => {
    expect(async () =>
      createStatementUseCase.execute({ user_id: "user_id", type: OperationType.DEPOSIT, amount: 100, description: "more cash" })
    ).rejects.toBeInstanceOf(CreateStatementError.UserNotFound)
  })

  it("should not be able to withdraw if insufficient funds", async () => {
    expect(async () => {
      const user = await inMemoryUserRepository.create({ name: "Test User", email: "test@example.com", password: "test_password" })

      await createStatementUseCase.execute({ user_id: (user.id as string), type: OperationType.WITHDRAW, amount: 10, description: "more cash" })
    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds)
  })

})
