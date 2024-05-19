package tdtu.edu.vn.novel_web.service;

import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import tdtu.edu.vn.novel_web.model.Author;
import tdtu.edu.vn.novel_web.model.Novel;
import tdtu.edu.vn.novel_web.repository.AuthorRepository;
import tdtu.edu.vn.novel_web.repository.ChapterRepository;
import tdtu.edu.vn.novel_web.repository.NovelRepository;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AuthorService {
    private final AuthorRepository authorRepository;
    private final CloudinaryService cloudinaryService;

    private final NovelRepository novelRepository;

    private final ChapterRepository chapterRepository;

    @Autowired
    public AuthorService(AuthorRepository authorRepository, CloudinaryService cloudinaryService, NovelRepository novelRepository, ChapterRepository chapterRepository) {
        this.authorRepository = authorRepository;
        this.cloudinaryService = cloudinaryService;
        this.novelRepository = novelRepository;
        this.chapterRepository = chapterRepository;
    }

    public List<Author> getAllAuthors() {
        return authorRepository.findAll();
    }

    public Author getAuthorById(String id){
        return authorRepository.findById(id).orElse(null);
    }

    public Author updateAuthor(Author updateAuthor, MultipartFile avatarFile) throws IOException {
        if(authorRepository.existsById(updateAuthor.getId())){
            if(avatarFile != null && !avatarFile.isEmpty()){
                Map uploadResult = cloudinaryService.upload(avatarFile, ObjectUtils.asMap("folder", "MongoDB_Web_Novel/authors"));
                updateAuthor.setAvatar((String) uploadResult.get("url"));
            }
            return authorRepository.save(updateAuthor);
        }
        return null;
    }

    public Author createAuthor(Author author, MultipartFile avatarFile) throws IOException {
        if(avatarFile != null && !avatarFile.isEmpty()){
            Map uploadResult = cloudinaryService.upload(avatarFile, ObjectUtils.asMap("folder", "MongoDB_Web_Novel/authors"));
            author.setAvatar((String) uploadResult.get("url"));
        }
        return authorRepository.save(author);
    }

    public boolean deleteAuthor(String id){
        if(authorRepository.existsById(id)){
            authorRepository.deleteById(id);
            return true;
        }
        return false;
    }





    public Map<String, Object> getAuthorDetailsById(String authorId) {
        Author author = authorRepository.findById(authorId).orElse(null);
        if (author == null) {
            return null;
        }

        List<Novel> novels = novelRepository.findByAuthorId(authorId);
        int novelCount = novels.size();

        int chapterCount = 0;
        for (Novel novel : novels) {
            chapterCount += chapterRepository.countByNovelId(novel.getId());
        }

        Map<String, Object> authorDetails = new HashMap<>();
        authorDetails.put("author", author);
        authorDetails.put("novelCount", novelCount);
        authorDetails.put("chapterCount", chapterCount);

        return authorDetails;
    }

}
