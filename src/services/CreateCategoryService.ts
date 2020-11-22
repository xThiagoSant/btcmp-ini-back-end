import { getRepository } from 'typeorm';
import Category from '../models/Category';
import FindCategoryDescriptionService from './FindCategoryDescriptionService';

interface Request {
  title: string;
}

class CreateCatgoryService {
  public async execute({ title }: Request): Promise<Category> {
    const categoriesRepository = getRepository(Category);

    const findCategoryDescriptionService = new FindCategoryDescriptionService();
    const categoryFinded = await findCategoryDescriptionService.execute({
      title,
    });
    if (categoryFinded) {
      return categoryFinded;
    }

    const category = categoriesRepository.create({ title });
    await categoriesRepository.save(category);
    return category;
  }
}

export default CreateCatgoryService;
