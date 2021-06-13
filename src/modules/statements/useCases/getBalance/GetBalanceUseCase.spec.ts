import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { IUsersRepository } from "../../../users/repositories/IUsersRepository"
import { OperationType } from "../../entities/Statement"
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { IStatementsRepository } from "../../repositories/IStatementsRepository"
import { GetBalanceError } from "./GetBalanceError"
import { GetBalanceUseCase } from "./GetBalanceUseCase"

let getBalanceUseCase: GetBalanceUseCase
let inMemoryUserRepository: IUsersRepository
let inMemoryStatementsRepository: IStatementsRepository


describe('Get Balance', () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUsersRepository()
    inMemoryStatementsRepository = new InMemoryStatementsRepository()
    getBalanceUseCase = new GetBalanceUseCase(inMemoryStatementsRepository, inMemoryUserRepository)
  }
  )

  it('should be able to get user balance', async () => {
    const user = await inMemoryUserRepository.create({ name: "Test User", email: "test@example.com", password: "test_password" })
    await inMemoryStatementsRepository.create({ user_id: (user.id as string), type: OperationType.DEPOSIT, amount: 100, description: "more cash" })
    await inMemoryStatementsRepository.create({ user_id: (user.id as string), type: OperationType.WITHDRAW, amount: 50, description: "more cash" })

    const response = await getBalanceUseCase.execute({ user_id: (user.id as string) })

    expect(response.statement.length).toBe(2)
    expect(response.balance).toBe(50)
  })

  it("shouldn't be able to show balance if user doesn't exist", () => {
    expect(async () =>
      getBalanceUseCase.execute({ user_id: "user_id", })
    ).rejects.toBeInstanceOf(GetBalanceError)
  })

})
