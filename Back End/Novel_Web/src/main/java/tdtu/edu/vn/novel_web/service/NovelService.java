package tdtu.edu.vn.novel_web.service;

import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import tdtu.edu.vn.novel_web.model.*;
import tdtu.edu.vn.novel_web.repository.*;

import java.io.IOException;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;


@Service
public class NovelService {
    private final NovelRepository novelRepository;
    private final ChapterRepository chapterRepository;

    private final CloudinaryService cloudinaryService;

    private final AuthorRepository authorRepository;

    private final CategoryRepository categoryRepository;

    private final ChapterService chapterService;

    private final AuthorService authorService;

    private CommentService commentService;

    private final CommentRepository commentRepository;

    private final UserRepository userRepository;

    @Autowired
    public NovelService(NovelRepository novelRepository,
                        ChapterRepository chapterRepository,
                        CloudinaryService cloudinaryService,
                        AuthorRepository authorRepository,
                        CategoryRepository categoryRepository,
                        ChapterService chapterService,
                        AuthorService authorService,
                        CommentRepository commentRepository, UserRepository userRepository) {
        this.novelRepository = novelRepository;
        this.chapterRepository = chapterRepository;
        this.cloudinaryService = cloudinaryService;
        this.authorRepository = authorRepository;
        this.categoryRepository = categoryRepository;
        this.chapterService = chapterService;
        this.authorService = authorService;
        this.commentRepository = commentRepository;
        this.userRepository = userRepository;
    }
    public Novel createNovel(Novel document, MultipartFile avatarFile, String categoryName, String authorName) throws IOException {
        if (avatarFile != null && !avatarFile.isEmpty()) {
            Map uploadResult = cloudinaryService.upload(avatarFile, ObjectUtils.asMap("folder", "MongoDB_Web_Novel"));
            document.setAvatarNovel((String) uploadResult.get("url"));
        }

        // Tìm Category và Author dựa trên tên
        Category category = categoryRepository.findByName(categoryName);
        Author author = authorRepository.findByName(authorName);

        // Nếu tìm thấy, gán categoryId và authorId tương ứng
        if (category != null) {
            document.setCategoryId(category.getId());
        }
        if (author != null) {
            document.setAuthorId(author.getId());
        }

        return novelRepository.save(document);
    }

    public List<Map<String, Object>> getAllNovels() {
        List<Novel> novels = novelRepository.findAll();
        List<Map<String, Object>> result = new ArrayList<>();

        // Lấy danh sách authorId và categoryId từ các tiểu thuyết
        Set<String> authorIds = novels.stream()
                .map(Novel::getAuthorId)
                .collect(Collectors.toSet());
        Set<String> categoryIds = novels.stream()
                .map(Novel::getCategoryId)
                .collect(Collectors.toSet());

        // Truy vấn danh sách tác giả và danh mục đồng thời
        Map<String, Author> authorMap = new HashMap<>();
        Map<String, Category> categoryMap = new HashMap<>();

        if (!authorIds.isEmpty()) {
            List<Author> authors = (List<Author>) authorRepository.findAllById(authorIds);
            authorMap = authors.stream()
                    .collect(Collectors.toMap(Author::getId, author -> author));
        }

        if (!categoryIds.isEmpty()) {
            List<Category> categories = (List<Category>) categoryRepository.findAllById(categoryIds);
            categoryMap = categories.stream()
                    .collect(Collectors.toMap(Category::getId, category -> category));
        }

        for (Novel novel : novels) {
            String authorId = novel.getAuthorId();
            String categoryId = novel.getCategoryId();

            // Tham chiếu thông tin tác giả từ authorMap
            Author author = authorMap.get(authorId);
            String authorName = author != null ? author.getName() : "Loading...";

            // Tham chiếu thông tin danh mục từ categoryMap
            Category category = categoryMap.get(categoryId);
            String categoryName = category != null ? category.getName() : "Loading...";

            Map<String, Object> novelData = new HashMap<>();
            novelData.put("novel", novel);
            novelData.put("authorName", authorName);
            novelData.put("categoryName", categoryName);

            result.add(novelData);
        }

        return result;
    }

    public Novel getNovelById(String id) {
        return novelRepository.findById(id).orElse(null);
    }

    public Novel updateNovel(Novel document, MultipartFile avatarFile, String categoryName, String authorName) throws IOException {
        if (novelRepository.existsById(document.getId())) {
            if (avatarFile != null && !avatarFile.isEmpty()) {
                Map uploadResult = cloudinaryService.upload(avatarFile, ObjectUtils.asMap("folder", "MongoDB_Web_Novel"));
                document.setAvatarNovel((String) uploadResult.get("url"));
            }

            // Tìm Category và Author dựa trên tên
            Category category = categoryRepository.findByName(categoryName);
            Author author = authorRepository.findByName(authorName);

            // Nếu tìm thấy, gán categoryId và authorId tương ứng
            if (category != null) {
                document.setCategoryId(category.getId());
            }
            if (author != null) {
                document.setAuthorId(author.getId());
            }

            return novelRepository.save(document);
        }
        return null;
    }

    public boolean deleteNovel(String id) {
        if (novelRepository.existsById(id)) {
            novelRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public Chapter addChapterToNovel(String novelId, Chapter newChapter) {
        Novel novel = novelRepository.findById(novelId).orElse(null);
        if (novel != null) {
            newChapter.setNovelId(novelId);
            newChapter.setNumberChapter(novel.getNumberChapter() + 1);
            newChapter.setCreatAt(new Date());
            newChapter.setUpdateAt(new Date());
            novel.setNumberChapter(newChapter.getNumberChapter());
            novelRepository.save(novel);
            return chapterRepository.save(newChapter);
        }
        return null;
    }

















    // NovelService.java
    public List<Map<String, Object>> getEditorPicks() {
        Pageable pageable = PageRequest.of(0, 8, Sort.by("recommendationCount").descending());
        List<Novel> novels = novelRepository.findTop8ByOrderByRecommendationCountDesc(pageable);
        List<String> authorIds = novels.stream().map(Novel::getAuthorId).collect(Collectors.toList());
        List<Author> authors = (List<Author>) authorRepository.findAllById(authorIds);
        Map<String, String> authorMap = authors.stream().collect(Collectors.toMap(Author::getId, Author::getName));

        List<Map<String, Object>> result = new ArrayList<>();
        for (Novel novel : novels) {
            Map<String, Object> novelData = new HashMap<>();
            novelData.put("novel", novel);
            novelData.put("authorName", authorMap.get(novel.getAuthorId()));
            result.add(novelData);
        }
        return result;
    }

    // NovelService.java
    // NovelService.java
    public List<Map<String, Object>> getNewUpdates() {
        Pageable pageable = PageRequest.of(0, 10, Sort.by("updateAt").descending());
        List<Novel> novels = novelRepository.findTop10ByOrderByUpdateAtDesc(pageable);
        List<String> categoryIds = novels.stream().map(Novel::getCategoryId).collect(Collectors.toList());
        List<String> authorIds = novels.stream().map(Novel::getAuthorId).collect(Collectors.toList());

        List<Category> categories = (List<Category>) categoryRepository.findAllById(categoryIds);
        List<Author> authors = (List<Author>) authorRepository.findAllById(authorIds);

        Map<String, String> categoryMap = categories.stream().collect(Collectors.toMap(Category::getId, Category::getName));
        Map<String, String> authorMap = authors.stream().collect(Collectors.toMap(Author::getId, Author::getName));

        List<Map<String, Object>> result = new ArrayList<>();
        for (Novel novel : novels) {
            Chapter lastChapter = chapterService.getLastChapterByNovelId(novel.getId());

            Map<String, Object> novelData = new HashMap<>();
            novelData.put("novel", novel);
            novelData.put("categoryName", categoryMap.get(novel.getCategoryId()));
            novelData.put("authorName", authorMap.get(novel.getAuthorId()));
            novelData.put("lastChapterName", lastChapter != null ? lastChapter.getNameChapter() : "");
            novelData.put("updateAt", lastChapter != null ? lastChapter.getUpdateAt() : null);
            result.add(novelData);
        }
        return result;
    }

    // NovelService.java
    public List<Novel> getMostRead() {
        Pageable pageable = PageRequest.of(0, 10, Sort.by("view").descending());
        return novelRepository.findTop10ByOrderByViewDesc(pageable);
    }

    public List<Novel> getMostPopular() {
        Pageable pageable = PageRequest.of(0, 10, Sort.by("commentCount").descending());
        return novelRepository.findTop10ByOrderByCommentationCountDesc(pageable);
    }

    public List<Novel> getMostRecommended() {
        Pageable pageable = PageRequest.of(0, 10, Sort.by("recommendationCount").descending());
        return novelRepository.findTop10ByOrderByRecommendationCountDesc(pageable);
    }

    public List<Map<String, Object>> getHighlyRated() {
        Pageable pageable = PageRequest.of(0, 10, Sort.by("averageRating").descending());
        List<Novel> novels = novelRepository.findTop10ByOrderByAverageRatingDescRatingCountDesc(pageable);
        List<String> authorIds = novels.stream().map(Novel::getAuthorId).collect(Collectors.toList());
        List<Author> authors = (List<Author>) authorRepository.findAllById(authorIds);
        Map<String, String> authorMap = authors.stream().collect(Collectors.toMap(Author::getId, Author::getName));

        List<Map<String, Object>> result = new ArrayList<>();
        for (Novel novel : novels) {
            Map<String, Object> novelData = new HashMap<>();
            novelData.put("novel", novel);
            novelData.put("authorName", authorMap.get(novel.getAuthorId()));
            result.add(novelData);
        }
        return result;
    }

    public List<Novel> getNewlyPosted() {
        Pageable pageable = PageRequest.of(0, 5, Sort.by("createAt").descending());
        return novelRepository.findTop5ByOrderByCreateAtDesc(pageable);
    }

    public List<Novel> getNewlyCompleted() {
        Pageable pageable = PageRequest.of(0, 10 , Sort.by("updateAt").descending());
        return novelRepository.findAllCompletedNovelsWithChapterCountGreaterThan5(pageable);
    }











    public Map<String, Object> getNovelDetail(String id) {
        Novel novel = novelRepository.findById(id).orElse(null);
        if (novel == null) {
            return null;
        }
        System.out.println("Novel: " + novel);

        novel.setView(novel.getView() + 1);
        novelRepository.save(novel);

        Author author = authorRepository.findById(novel.getAuthorId()).orElse(null);
        Category category = categoryRepository.findById(novel.getCategoryId()).orElse(null);
        List<Comment> comments = commentRepository.findByNovelId(id);
        List<Map<String, Object>> commentList = new ArrayList<>();

        for (Comment comment : comments) {
            User user = userRepository.findById(comment.getUserId()).orElse(null);
            Map<String, Object> commentData = new HashMap<>();
            commentData.put("comment", comment);

            if (user != null) {
                Map<String, Object> userData = new HashMap<>();
                userData.put("id", user.getId());
                userData.put("username", user.getUsername());
                userData.put("avatar", user.getAvatar());
                commentData.put("user", userData);
            }

            commentList.add(commentData);
        }

        System.out.println("Comments: " + commentList);

        int totalChapters = chapterRepository.countByNovelId(id);
        List<Chapter> chapters = chapterRepository.findByNovelIdOrderByNumberChapterAsc(id);
        Chapter latestChapter = chapterRepository.findFirstByNovelIdOrderByCreatAtDesc(id);
        System.out.println("Latest Chapter: " + latestChapter);
        int totalNovels = 0;
        if (author != null) {
            totalNovels = novelRepository.countByAuthorId(author.getId());
        }

        Map<String, Object> novelDetail = new HashMap<>();
        novelDetail.put("novel", novel);
        novelDetail.put("author", author);
        novelDetail.put("category", category);
        novelDetail.put("comments", commentList);
        novelDetail.put("totalChapters", totalChapters);
        novelDetail.put("chapters", chapters);
        novelDetail.put("latestChapter", latestChapter);
        novelDetail.put("totalNovels", totalNovels);
        System.out.println("Novel Detail: " + novelDetail);

        return novelDetail;
    }

    public void incrementViewCount(String novelId) {
        Novel novel = novelRepository.findById(novelId).orElse(null);
        if (novel != null) {
            novel.setView(novel.getView() + 1);
            novelRepository.save(novel);
        }
    }

    public void incrementCommentCount(String novelId) {
        Novel novel = novelRepository.findById(novelId).orElse(null);
        if (novel != null) {
            novel.setCommentCount(novel.getCommentCount() + 1);
            novelRepository.save(novel);
        }
    }

    public void incrementFavoriteCount(String novelId) {
        Novel novel = novelRepository.findById(novelId).orElse(null);
        if (novel != null) {
            novel.setFavoriteCount(novel.getFavoriteCount() + 1);
            novelRepository.save(novel);
        }
    }

    public void incrementRecommendationCount(String novelId) {
        Novel novel = novelRepository.findById(novelId).orElse(null);
        if (novel != null) {
            novel.setRecommendationCount(novel.getRecommendationCount() + 1);
            novelRepository.save(novel);
        }
    }

    public void updateRating(String novelId, int score) {
        Novel novel = novelRepository.findById(novelId).orElse(null);
        if (novel != null) {
            int oldRatingCount = novel.getRatingCount();
            double oldAverageRating = novel.getAverageRating();
            int newRatingCount = oldRatingCount + 1;
            double newAverageRating = (oldAverageRating * oldRatingCount + score) / newRatingCount;

            novel.setRatingCount(newRatingCount);
            novel.setAverageRating(newAverageRating);
            novelRepository.save(novel);
        }
    }



    // ...

    // ...

    public Page<Map<String, Object>> searchNovels(String keyword, List<String> categoryIds, String viewFilter, String ratingFilter, String chapterFilter, Pageable pageable) {
        List<Novel> novels = novelRepository.findByNameNovelContainingIgnoreCase(keyword);

        if (categoryIds != null && !categoryIds.isEmpty()) {
            novels = novels.stream()
                    .filter(novel -> categoryIds.contains(novel.getCategoryId()))
                    .collect(Collectors.toList());
        }

        if (viewFilter != null && !viewFilter.isEmpty()) {
            if (viewFilter.equals("1-1000")) {
                novels = novels.stream()
                        .filter(novel -> novel.getView() <= 1000)
                        .collect(Collectors.toList());
            } else if (viewFilter.equals("1000+")) {
                novels = novels.stream()
                        .filter(novel -> novel.getView() > 1000)
                        .collect(Collectors.toList());
            }
        }

        if (ratingFilter != null && !ratingFilter.isEmpty()) {
            if (ratingFilter.equals("1-2")) {
                novels = novels.stream()
                        .filter(novel -> novel.getAverageRating() < 2)
                        .collect(Collectors.toList());
            } else if (ratingFilter.equals("2-3")) {
                novels = novels.stream()
                        .filter(novel -> novel.getAverageRating() >= 2 && novel.getAverageRating() < 3)
                        .collect(Collectors.toList());
            } else if (ratingFilter.equals("3-4")) {
                novels = novels.stream()
                        .filter(novel -> novel.getAverageRating() >= 3 && novel.getAverageRating() < 4)
                        .collect(Collectors.toList());
            } else if (ratingFilter.equals("4-5")) {
                novels = novels.stream()
                        .filter(novel -> novel.getAverageRating() >= 4)
                        .collect(Collectors.toList());
            }
        }

        if (chapterFilter != null && !chapterFilter.isEmpty()) {
            if (chapterFilter.equals("1-10")) {
                novels = novels.stream()
                        .filter(novel -> novel.getNumberChapter() <= 10)
                        .collect(Collectors.toList());
            } else if (chapterFilter.equals("10-50")) {
                novels = novels.stream()
                        .filter(novel -> novel.getNumberChapter() > 10 && novel.getNumberChapter() <= 50)
                        .collect(Collectors.toList());
            } else if (chapterFilter.equals("50-100")) {
                novels = novels.stream()
                        .filter(novel -> novel.getNumberChapter() > 50 && novel.getNumberChapter() <= 100)
                        .collect(Collectors.toList());
            } else if (chapterFilter.equals("100+")) {
                novels = novels.stream()
                        .filter(novel -> novel.getNumberChapter() > 100)
                        .collect(Collectors.toList());
            }
        }

        novels.sort((novel1, novel2) -> {
            int keywordComparison = Boolean.compare(novel2.getNameNovel().contains(keyword), novel1.getNameNovel().contains(keyword));
            if (keywordComparison != 0) {
                return keywordComparison;
            }

            int categoryComparison = novel1.getCategoryId().compareTo(novel2.getCategoryId());
            if (categoryComparison != 0) {
                return categoryComparison;
            }

            int viewComparison = Integer.compare(novel2.getView(), novel1.getView());
            if (viewComparison != 0) {
                return viewComparison;
            }

            int ratingComparison = Double.compare(novel2.getAverageRating(), novel1.getAverageRating());
            if (ratingComparison != 0) {
                return ratingComparison;
            }

            return Integer.compare(novel2.getNumberChapter(), novel1.getNumberChapter());
        });

        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), novels.size());
        Page<Novel> page = new PageImpl<>(novels.subList(start, end), pageable, novels.size());

        return page.map(this::getNovelDetail);
    }
    private Map<String, Object> getNovelDetail(Novel novel) {
        Map<String, Object> novelDetail = new HashMap<>();
        novelDetail.put("novel", novel);

        Category category = categoryRepository.findById(novel.getCategoryId()).orElse(null);
        if (category != null) {
            novelDetail.put("categoryName", category.getName());
        }

        Author author = authorRepository.findById(novel.getAuthorId()).orElse(null);
        if (author != null) {
            novelDetail.put("authorName", author.getName());
        }

        return novelDetail;
    }




// ...

// ...



    // NovelService.java

    public Page<Map<String, Object>> getNovelsByPage(String pageName, Pageable pageable, List<String> categoryIds, String viewFilter, String ratingFilter, String chapterFilter) {
        List<Novel> novels = new ArrayList<>();

        switch (pageName) {
            case "editor-picks":
                novels = novelRepository.findAll(Sort.by("recommendationCount").descending());
                break;
            case "new-updates":
                novels = novelRepository.findAll(Sort.by("updateAt").descending());
                break;
            case "most-read":
                novels = novelRepository.findAll(Sort.by("view").descending());
                break;
            case "most-popular":
                novels = novelRepository.findAll(Sort.by("commentCount").descending());
                break;
            case "most-recommended":
                novels = novelRepository.findAll(Sort.by("recommendationCount").descending());
                break;
            case "highly-rated":
                novels = novelRepository.findAll(Sort.by("averageRating").descending().and(Sort.by("ratingCount").descending()));
                break;
            case "newly-posted":
                novels = novelRepository.findAll(Sort.by("createAt").descending());
                break;
            case "newly-completed":
                novels = novelRepository.findAllCompletedNovelsWithChapterCountGreaterThan5((Pageable) Sort.by("updateAt").descending());
                break;
            default:
                novels = novelRepository.findAll(Sort.by("updateAt").descending());
        }

        // Lọc novels theo các bộ lọc khác (categoryIds, viewFilter, ratingFilter, chapterFilter)
        if (categoryIds != null && !categoryIds.isEmpty()) {
            novels = novels.stream()
                    .filter(novel -> categoryIds.contains(novel.getCategoryId()))
                    .collect(Collectors.toList());
        }

        if (viewFilter != null && !viewFilter.isEmpty()) {
            if (viewFilter.equals("1-1000")) {
                novels = novels.stream()
                        .filter(novel -> novel.getView() <= 1000)
                        .collect(Collectors.toList());
            } else if (viewFilter.equals("1000+")) {
                novels = novels.stream()
                        .filter(novel -> novel.getView() > 1000)
                        .collect(Collectors.toList());
            }
        }

        if (ratingFilter != null && !ratingFilter.isEmpty()) {
            if (ratingFilter.equals("1-2")) {
                novels = novels.stream()
                        .filter(novel -> novel.getAverageRating() < 2)
                        .collect(Collectors.toList());
            } else if (ratingFilter.equals("2-3")) {
                novels = novels.stream()
                        .filter(novel -> novel.getAverageRating() >= 2 && novel.getAverageRating() < 3)
                        .collect(Collectors.toList());
            } else if (ratingFilter.equals("3-4")) {
                novels = novels.stream()
                        .filter(novel -> novel.getAverageRating() >= 3 && novel.getAverageRating() < 4)
                        .collect(Collectors.toList());
            } else if (ratingFilter.equals("4-5")) {
                novels = novels.stream()
                        .filter(novel -> novel.getAverageRating() >= 4)
                        .collect(Collectors.toList());
            }
        }

        if (chapterFilter != null && !chapterFilter.isEmpty()) {
            if (chapterFilter.equals("1-10")) {
                novels = novels.stream()
                        .filter(novel -> novel.getNumberChapter() <= 10)
                        .collect(Collectors.toList());
            } else if (chapterFilter.equals("10-50")) {
                novels = novels.stream()
                        .filter(novel -> novel.getNumberChapter() > 10 && novel.getNumberChapter() <= 50)
                        .collect(Collectors.toList());
            } else if (chapterFilter.equals("50-100")) {
                novels = novels.stream()
                        .filter(novel -> novel.getNumberChapter() > 50 && novel.getNumberChapter() <= 100)
                        .collect(Collectors.toList());
            } else if (chapterFilter.equals("100+")) {
                novels = novels.stream()
                        .filter(novel -> novel.getNumberChapter() > 100)
                        .collect(Collectors.toList());
            }
        }

        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), novels.size());
        Page<Novel> novelPage = new PageImpl<>(novels.subList(start, end), pageable, novels.size());

        return novelPage.map(this::getNovelDetail);
    }



    public List<Map<String, Object>> getSearchSuggestions(String keyword) {
        List<Novel> novels = novelRepository.findByNameNovelContainingIgnoreCase(keyword);
        List<Map<String, Object>> suggestions = new ArrayList<>();

        for (Novel novel : novels) {
            Map<String, Object> suggestion = new HashMap<>();
            suggestion.put("id", novel.getId());
            suggestion.put("nameNovel", novel.getNameNovel());

            // Lấy thông tin tác giả từ AuthorRepository
            Author author = authorRepository.findById(novel.getAuthorId()).orElse(null);
            if (author != null) {
                suggestion.put("author", author.getName());
            } else {
                suggestion.put("author", "Unknown");
            }

            // Lấy thông tin tác giả từ AuthorRepository
            Category category = categoryRepository.findById(novel.getCategoryId()).orElse(null);
            if (author != null) {
                suggestion.put("category", category.getName());
            } else {
                suggestion.put("category", "Unknown");
            }

            suggestion.put("averageRating", novel.getAverageRating());
            suggestions.add(suggestion);

            if (suggestions.size() == 3) {
                break;
            }
        }

        return suggestions;
    }


    // NovelService.java
// ...

    // NovelService.java
// ...

    public Page<Map<String, Object>> getNovelsByRanking(String rankingType, Pageable pageable, List<String> categoryIds, String viewFilter, String ratingFilter, String chapterFilter) {
        List<Novel> novels = new ArrayList<>();

        switch (rankingType) {
            case "most-popular":
                novels = novelRepository.findAllByOrderByCommentCountDesc();
                break;
            case "most-read":
                novels = novelRepository.findAllByOrderByViewDesc();
                break;
            case "most-recommended":
                novels = novelRepository.findAllByOrderByRecommendationCountDesc();
                break;
            case "highly-rated":
                novels = novelRepository.findAllByOrderByAverageRatingDescRatingCountDesc();
                break;
            default:
                throw new IllegalArgumentException("Invalid ranking type: " + rankingType);
        }

        // Áp dụng các bộ lọc
        if (categoryIds != null && !categoryIds.isEmpty()) {
            novels = novels.stream()
                    .filter(novel -> categoryIds.contains(novel.getCategoryId()))
                    .collect(Collectors.toList());
        }

        if (viewFilter != null && !viewFilter.isEmpty()) {
            if (viewFilter.equals("1-1000")) {
                novels = novels.stream()
                        .filter(novel -> novel.getView() <= 1000)
                        .collect(Collectors.toList());
            } else if (viewFilter.equals("1000+")) {
                novels = novels.stream()
                        .filter(novel -> novel.getView() > 1000)
                        .collect(Collectors.toList());
            }
        }

        if (ratingFilter != null && !ratingFilter.isEmpty()) {
            if (ratingFilter.equals("1-2")) {
                novels = novels.stream()
                        .filter(novel -> novel.getAverageRating() < 2)
                        .collect(Collectors.toList());
            } else if (ratingFilter.equals("2-3")) {
                novels = novels.stream()
                        .filter(novel -> novel.getAverageRating() >= 2 && novel.getAverageRating() < 3)
                        .collect(Collectors.toList());
            } else if (ratingFilter.equals("3-4")) {
                novels = novels.stream()
                        .filter(novel -> novel.getAverageRating() >= 3 && novel.getAverageRating() < 4)
                        .collect(Collectors.toList());
            } else if (ratingFilter.equals("4-5")) {
                novels = novels.stream()
                        .filter(novel -> novel.getAverageRating() >= 4)
                        .collect(Collectors.toList());
            }
        }

        if (chapterFilter != null && !chapterFilter.isEmpty()) {
            if (chapterFilter.equals("1-10")) {
                novels = novels.stream()
                        .filter(novel -> novel.getNumberChapter() <= 10)
                        .collect(Collectors.toList());
            } else if (chapterFilter.equals("10-50")) {
                novels = novels.stream()
                        .filter(novel -> novel.getNumberChapter() > 10 && novel.getNumberChapter() <= 50)
                        .collect(Collectors.toList());
            } else if (chapterFilter.equals("50-100")) {
                novels = novels.stream()
                        .filter(novel -> novel.getNumberChapter() > 50 && novel.getNumberChapter() <= 100)
                        .collect(Collectors.toList());
            } else if (chapterFilter.equals("100+")) {
                novels = novels.stream()
                        .filter(novel -> novel.getNumberChapter() > 100)
                        .collect(Collectors.toList());
            }
        }

        // Sắp xếp lại danh sách tiểu thuyết theo tiêu chí tương ứng
        Comparator<Novel> comparator = null;
        switch (rankingType) {
            case "most-popular":
                comparator = Comparator.comparing(Novel::getCommentCount).reversed();
                System.out.println("Most Popular");
                break;
            case "most-read":
                comparator = Comparator.comparing(Novel::getView).reversed();
                break;
            case "most-recommended":
                comparator = Comparator.comparing(Novel::getRecommendationCount).reversed();
                break;
            case "highly-rated":
                comparator = Comparator.comparing(Novel::getAverageRating).reversed()
                        .thenComparing(Comparator.comparing(Novel::getRatingCount).reversed());
                break;
        }
        if (comparator != null) {
            novels.sort(comparator);
        }

        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), novels.size());
        Page<Novel> novelPage = new PageImpl<>(novels.subList(start, end), pageable, novels.size());

        return novelPage.map(this::getNovelDetail);
    }




// ...

// ...
}