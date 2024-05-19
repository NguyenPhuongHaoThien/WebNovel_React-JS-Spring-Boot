package tdtu.edu.vn.novel_web.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import tdtu.edu.vn.novel_web.service.NovelService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/search")
public class SearchController {
    private final NovelService novelService;

    @Autowired
    public SearchController(NovelService novelService) {
        this.novelService = novelService;
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> searchNovels(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) List<String> categoryIds,
            @RequestParam(required = false) String viewFilter,
            @RequestParam(required = false) String ratingFilter,
            @RequestParam(required = false) String chapterFilter,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "16") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Map<String, Object>> novels = novelService.searchNovels(keyword, categoryIds, viewFilter, ratingFilter, chapterFilter, pageable);
        Map<String, Object> response = Map.of(
                "novels", novels.getContent(),
                "currentPage", novels.getNumber(),
                "totalPages", novels.getTotalPages()
        );
        return ResponseEntity.ok(response);
    }


    @GetMapping("/suggestions")
    public ResponseEntity<List<Map<String, Object>>> getSearchSuggestions(@RequestParam String keyword) {
        List<Map<String, Object>> suggestions = novelService.getSearchSuggestions(keyword);

        // Sắp xếp danh sách suggestions theo keyword từ trái sang phải và trên xuống dưới
        suggestions.sort((s1, s2) -> {
            String name1 = (String) s1.get("nameNovel");
            String name2 = (String) s2.get("nameNovel");
            return name1.compareToIgnoreCase(name2);
        });

        return ResponseEntity.ok(suggestions);
    }
}