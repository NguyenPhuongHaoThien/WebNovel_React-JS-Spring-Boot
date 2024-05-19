package tdtu.edu.vn.novel_web.service;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import tdtu.edu.vn.novel_web.model.Category;
import tdtu.edu.vn.novel_web.repository.CategoryRepository;

import java.util.List;

@Service
@AllArgsConstructor
public class CategoryService {
    private final CategoryRepository categoryRepository;

    public Category getCategoryById(String id){
        return categoryRepository.findById(id).orElse(null);
    }

    public Category updateCategory(Category updateCategory){
        if(categoryRepository.existsById(updateCategory.getId())){
            return categoryRepository.save(updateCategory);
        }
        return null;
    }

    public Category createCategory(Category category){
        return categoryRepository.save(category);
    }

    public boolean deleteCategory(String id){
        if(categoryRepository.existsById(id)){
            categoryRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public List<Category> getAllCategory() {
        return categoryRepository.findAll();
    }

}
