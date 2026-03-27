package mil.t2com.moda.todo.category;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @PostMapping("/category")
    @ResponseStatus(HttpStatus.CREATED)
    public Category saveNewCategory(@RequestBody Category category) {
        return categoryService.saveCategory(category);
    }

    @GetMapping(value = "/category")
    public List<Category> getAllCategories() {
        return categoryService.findAllCategories();
    }

//    @GetMapping()
//    public Optional<Category> findCategoryByLabelUsingRequestParam(@RequestParam String categoryLabel) {
//        return categoryService.findCategoryByLabel(categoryLabel);
//    }

    @GetMapping("/category/{categoryLabel}")
    public ResponseEntity<Category> findCategoryByLabelUsingPathVariable(@PathVariable String categoryLabel) {
        return categoryService.findCategoryByLabel(categoryLabel)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping(value = "/category/id/", params = "id")
    public Optional<Category> findCategoryById(@RequestParam Long id) {
        return categoryService.findCategoryById(id);
    }

    // ADD with Tests for:  Put, Delete
}
