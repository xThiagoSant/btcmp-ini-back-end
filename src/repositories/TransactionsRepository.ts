import { EntityRepository, Repository, getRepository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  private balanceFromType(
    transactions: Transaction[],
    type: 'income' | 'outcome',
  ): number {
    const value = transactions
      .filter(transac => transac.type === type)
      .reduce(
        (previousValue, currentValue) =>
          previousValue + Number(currentValue.value),
        0,
      );
    return value;
  }

  public async getAll(): Promise<Transaction[]> {
    const transactionsRepository = getRepository(Transaction);
    const transactions = await transactionsRepository.find();
    return transactions;
  }

  public async getBalance(transactions: Transaction[]): Promise<Balance> {
    const totalIncome = this.balanceFromType(transactions, 'income');
    const totalOutcome = this.balanceFromType(transactions, 'outcome');
    const total = totalIncome - totalOutcome;
    return {
      income: totalIncome,
      outcome: totalOutcome,
      total,
    };
  }
}

export default TransactionsRepository;
