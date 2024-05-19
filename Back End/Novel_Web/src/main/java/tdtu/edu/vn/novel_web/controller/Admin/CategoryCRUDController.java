package tdtu.edu.vn.novel_web.controller.Admin;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tdtu.edu.vn.novel_web.model.Category;
import tdtu.edu.vn.novel_web.service.CategoryService;

import java.util.List;

@RestController
@RequestMapping("/admin/category_management")
public class CategoryCRUDController {
    private final CategoryService categoryService;
    @Autowired
    public CategoryCRUDController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }
    @GetMapping
    public ResponseEntity<List<Category>> getAllCategory() {
        List<Category> categories = categoryService.getAllCategory();
        if (categories == null) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
        return ResponseEntity.ok(categories);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Category> getCategoryById(@PathVariable String id) {
        Category category = categoryService.getCategoryById(id);
        if (category == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(category);
    }

    @PostMapping("/create-category")
    public ResponseEntity<Category> createCategory(@RequestBody Category newCategory) {
        newCategory.setId(null);
        Category savedCategory = categoryService.createCategory(newCategory);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedCategory);
    }

    @PostMapping("/update-category")
    public ResponseEntity<Category> updateCategory(@RequestBody Category updatedCategory) {
        Category existingCategory = categoryService.getCategoryById(updatedCategory.getId());
        if (existingCategory == null) {
            return ResponseEntity.notFound().build();
        }
        Category savedCategory = categoryService.updateCategory(updatedCategory);
        return ResponseEntity.ok(savedCategory);
    }

    @PostMapping("/delete-category")
    public ResponseEntity<Void> deleteCategory(@RequestBody Category category) {
        Category existingCategory = categoryService.getCategoryById(category.getId());
        if (existingCategory == null) {
            return ResponseEntity.notFound().build();
        }
        if (categoryService.deleteCategory(category.getId())) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }

}
