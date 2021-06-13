import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { IUsersRepository } from "../../../users/repositories/IUsersRepository"
import { OperationType } from "../../entities/Statement"
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { IStatementsRepository } from "../../repositories/IStatementsRepository"
import { GetStatementOperationError } from "./GetStatementOperationError"
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase"

let getStatementOperation: GetStatementOperationUseCase
let inMemoryUserRepository: IUsersRepository
let inMemoryStatementsRepository: IStatementsRepository


describe('Get Statement Operations', () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUsersRepository()
    inMemoryStatementsRepository = new InMemoryStatementsRepository()
    getStatementOperation = new GetStatementOperationUseCase(inMemoryUserRepository, inMemoryStatementsRepository)
  }
  )

  it('should be able to get user balance', async () => {
    const user = await inMemoryUserRepository.create({ name: "Test User", email: "test@example.com", password: "test_password" })
    const statement = await inMemoryStatementsRepository.create({ user_id: (user.id as string), type: OperationType.DEPOSIT, amount: 100, description: "more cash" })


    const response = await getStatementOperation.execute({ user_id: (user.id as string), statement_id: (statement.id as string) })


    expect(response.id).toBe(response.id)
  })

  it("shouldn't be able to show balance if statement operation doesn't exist", () => {
    expect(async () => {
      const user = await inMemoryUserRepository.create({ name: "Test User", email: "test@example.com", password: "test_password" })

      await getStatementOperation.execute({ user_id: (user.id as string), statement_id: "statement_id" })
    }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound)
  })

})
