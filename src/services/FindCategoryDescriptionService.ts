import { getRepository } from 'typeorm';
import Category from '../models/Category';

interface Request {
  title: string;
}

class FindCategoryDescriptionService {
  public async execute({ title }: Request): Promise<Category | undefined> {
    const categoryRepository = getRepository(Category);
    const category = await categoryRepository.findOne({ title });
    return category;
  }
}

export default FindCategoryDescriptionService;
