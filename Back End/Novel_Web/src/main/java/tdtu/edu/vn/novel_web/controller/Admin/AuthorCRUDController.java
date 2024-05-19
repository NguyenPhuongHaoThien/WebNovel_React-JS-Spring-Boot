package tdtu.edu.vn.novel_web.controller.Admin;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import tdtu.edu.vn.novel_web.model.Author;
import tdtu.edu.vn.novel_web.service.AuthorService;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/admin/author_management")
public class AuthorCRUDController {
    private final AuthorService authorService;

    public AuthorCRUDController(AuthorService authorService) {
        this.authorService = authorService;
    }

    @GetMapping
    public ResponseEntity<List<Author>> getAllAuthors(){
        List<Author> authors = authorService.getAllAuthors();
        if(authors == null){
            return ResponseEntity.status(500).build();
        }
        return ResponseEntity.ok(authors);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Author> getNovelById(@PathVariable String id) {
        Author author = authorService.getAuthorById(id);
        if (author == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(author);
    }

    @PostMapping(value = "/create-author", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Author> createAuthor(@RequestParam("author") String newAuthorJson,
                                               @RequestParam(value = "avatarFile", required = false)
                                               MultipartFile avatarFile) throws IOException {
        try {
            Author newAuthor = new ObjectMapper().readValue(newAuthorJson, Author.class);
            newAuthor.setId(null);
            Author savedAuthor = authorService.createAuthor(newAuthor, avatarFile);
            if(savedAuthor == null){
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
            }
            return ResponseEntity.status(HttpStatus.CREATED).body(savedAuthor);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping(value = "/update-author-info", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Author> updateAuthor(@RequestParam("author") String updatedAuthorJson,
                                               @RequestParam(value = "avatarFile", required = false)
                                               MultipartFile avatarFile) throws IOException {
        try {
            Author updatedAuthor = new ObjectMapper().readValue(updatedAuthorJson, Author.class);
            Author existingAuthor = authorService.getAuthorById(updatedAuthor.getId());
            if (existingAuthor == null) {
                return ResponseEntity.notFound().build();
            }
            Author savedAuthor = authorService.updateAuthor(updatedAuthor, avatarFile);
            if (savedAuthor == null) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
            }
            return ResponseEntity.ok(savedAuthor);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }




}
