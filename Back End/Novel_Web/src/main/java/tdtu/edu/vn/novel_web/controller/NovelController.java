// NovelController.java
package tdtu.edu.vn.novel_web.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tdtu.edu.vn.novel_web.service.NovelService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/novels")
public class NovelController {
    private final NovelService novelService;

    @Autowired
    public NovelController(NovelService novelService) {
        this.novelService = novelService;
    }

    @GetMapping("/page/{page}")
    public ResponseEntity<Map<String, Object>> getNovelsByPage(
            @PathVariable String page,
            @RequestParam(defaultValue = "0") int pageNumber,
            @RequestParam(defaultValue = "16") int pageSize,
            @RequestParam(required = false) List<String> categoryIds,
            @RequestParam(required = false) String viewFilter,
            @RequestParam(required = false) String ratingFilter,
            @RequestParam(required = false) String chapterFilter
    ) {
        Pageable pageable = PageRequest.of(pageNumber, pageSize);
        Page<Map<String, Object>> novels = novelService.getNovelsByPage(page, pageable, categoryIds, viewFilter, ratingFilter, chapterFilter);
        Map<String, Object> response = Map.of(
                "novels", novels.getContent(),
                "currentPage", novels.getNumber(),
                "totalPages", novels.getTotalPages()
        );
        return ResponseEntity.ok(response);
    }

    @GetMapping("/page/rankings/{rankingType}")
    public ResponseEntity<Map<String, Object>> getNovelsByRanking(
            @PathVariable String rankingType,
            @RequestParam(defaultValue = "0") int pageNumber,
            @RequestParam(defaultValue = "16") int pageSize,
            @RequestParam(required = false) List<String> categoryIds,
            @RequestParam(required = false) String viewFilter,
            @RequestParam(required = false) String ratingFilter,
            @RequestParam(required = false) String chapterFilter
    ) {
        Pageable pageable = PageRequest.of(pageNumber, pageSize);
        Page<Map<String, Object>> novels = novelService.getNovelsByRanking(rankingType, pageable, categoryIds, viewFilter, ratingFilter, chapterFilter);
        Map<String, Object> response = Map.of(
                "novels", novels.getContent(),
                "currentPage", novels.getNumber(),
                "totalPages", novels.getTotalPages()
        );
        return ResponseEntity.ok(response);
    }
}