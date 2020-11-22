import { Router } from 'express';
import multer from 'multer';

import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
import ImportTransactionsService from '../services/ImportTransactionsService';

import uploadConfig from '../config/upload';

const upload = multer(uploadConfig);

const transactionsRouter = Router();

const transactionsRepository = new TransactionsRepository();

transactionsRouter.get('/', async (request, response) => {
  const transactions = await transactionsRepository.getAll();
  const balance = await transactionsRepository.getBalance(transactions);
  return response.json({
    transactions,
    balance,
  });
});

transactionsRouter.post('/', async (request, response) => {
  try {
    const { title, value, type, category } = request.body;
    const createTransactionService = new CreateTransactionService();

    const transactions = await transactionsRepository.getAll();
    const balance = await transactionsRepository.getBalance(transactions);
    const { total } = balance;

    const transaction = await createTransactionService.execute({
      title,
      value,
      type,
      categoryDescription: category,
      total,
    });

    return response.json(transaction);
  } catch (error) {
    console.log(error);
    return response.status(400).json(error);
  }
});

transactionsRouter.delete('/:id', async (request, response) => {
  const { id } = request.params;
  const deleteTransactionService = new DeleteTransactionService();
  await deleteTransactionService.execute({ id });
  return response.status(204).send();
});

transactionsRouter.post(
  '/import',
  upload.single('file'),
  async (request, response) => {
    const importTransactionsService = new ImportTransactionsService();
    const transformations = await importTransactionsService.execute(
      request.file.path,
    );
    return response.json(transformations);
  },
);

export default transactionsRouter;
