package mil.t2com.moda.todo.category;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import tools.jackson.databind.ObjectMapper;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasSize;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.content;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(CategoryController.class)
class CategoryControllerTest {

    @Autowired
    MockMvc mockMvc;

    @Autowired
    ObjectMapper objectMapper;

    @MockitoBean
    CategoryService categoryService;

    @Captor
    ArgumentCaptor<Category> captor = ArgumentCaptor.forClass(Category.class);

    Category normal;
    Category edit;
    List<Category> categories = new ArrayList<>();

    @BeforeEach
    void setUp() {
        normal = new Category("Normal");
        edit = new Category("Edit");
        normal.setId(1L);
        edit.setId(2L);

        categories = new ArrayList<>(List.of(normal, edit));

        when(categoryService.saveCategory(any(Category.class))).thenReturn(normal);
//        Mockito.when(categoryService.saveCategory(Mockito.any(Category.class))).thenReturn(normal);
        Mockito.when(categoryService.findAllCategories()).thenReturn(categories);
        when(categoryService.findCategoryByLabel(normal.getLabel())).thenReturn(Optional.of(normal));
        when(categoryService.findCategoryById(normal.getId())).thenReturn(Optional.of(normal));
    }

    @Test
    void shouldSaveNewCategory() throws Exception {
        // Act
        mockMvc.perform(post("/api/v1/category")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(normal)))
                // result matchers
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.label").value("Normal"));

        // Assert
        verify(categoryService, only()).saveCategory(captor.capture());
        assertThat(captor.getValue()).usingRecursiveComparison().isEqualTo(normal);

        verify(categoryService, times(1)).saveCategory(any(Category.class));
    }

    @Test
    void shouldSaveCategoryNonArguementCaptor() throws Exception {
        // Act
        mockMvc.perform(post("/api/v1/category")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(normal)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.label").value("Normal"));
        // Assert
        verify(categoryService, only()).saveCategory(any(Category.class));
    }

    @Test
    void shouldFindAllCategories() throws Exception {
        // Act
        mockMvc.perform(get("/api/v1/category"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)));
        // Assert
        verify(categoryService, only()).findAllCategories();
    }

    // Two different examples
    // You will need to uncomment in the Controller to make the other one work.
    // Difference being "Path Variable" and "Request Parameter"
    @Test
    void shouldFindCategoryByLabelAsPathVarialble() throws Exception {
        // Act
        mockMvc.perform(get("/api/v1/category/Normal")
                //.param("categoryLabel", "Normal")
                        .content(MediaType.APPLICATION_JSON_VALUE))
                .andExpect(status().is2xxSuccessful())
                .andExpect(jsonPath("$.label").value("Normal"));
        // Assert
        verify(categoryService).findCategoryByLabel(normal.getLabel());
    }

    @Test
    void shouldFindCategoryByLabelAsQueryParam() throws Exception {
        // Act
        mockMvc.perform(get("/api/v1/category/{categoryLabel}", "Normal")
                 // Or use query parameter  .param("categoryLabel", "Normal")
                        .content(MediaType.APPLICATION_JSON_VALUE))
                .andExpect(status().is2xxSuccessful())
                .andExpect(jsonPath("$.label").value("Normal"));
        // Assert
        verify(categoryService).findCategoryByLabel(normal.getLabel());
    }

    @Test
    void shouldFindCategoryById() throws Exception {
        Long id = 1L;
        // Act
        mockMvc.perform(get("/api/v1/category/id/")
                .param("id", id.toString())
                .content(MediaType.APPLICATION_JSON_VALUE))
                .andExpect(status().is2xxSuccessful())
                .andExpect(jsonPath("$.label").value("Normal"));
        // Assert
        verify(categoryService).findCategoryById(normal.getId());
    }

}