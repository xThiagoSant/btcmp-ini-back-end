import { getRepository } from 'typeorm';
import Transaction from '../models/Transaction';
import CreateCategoryService from './CreateCategoryService';
import AppError from '../errors/AppError';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  categoryDescription: string;
  total: number;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    categoryDescription,
    total,
  }: Request): Promise<Transaction> {
    if (!['income', 'outcome'].includes(type)) {
      throw new AppError('Type not supported');
    }
    if (type === 'outcome') {
      if (value > total) {
        throw new AppError('Insufficient balance');
      }
    }

    const transRepository = getRepository(Transaction);

    const createCategoryService = new CreateCategoryService();
    const category = await createCategoryService.execute({
      title: categoryDescription,
    });
    const category_id = category.id;

    const transaction = transRepository.create({
      title,
      value,
      type,
      category_id,
    });

    await transRepository.save(transaction);
    return transaction;
  }
}

export default CreateTransactionService;
