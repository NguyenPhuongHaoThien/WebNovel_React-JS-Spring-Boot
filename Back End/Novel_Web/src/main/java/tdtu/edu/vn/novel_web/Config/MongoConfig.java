package tdtu.edu.vn.novel_web.Config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.index.TextIndexDefinition;
import org.springframework.data.mongodb.core.index.TextIndexDefinition.TextIndexDefinitionBuilder;
import tdtu.edu.vn.novel_web.model.Novel;

import javax.annotation.PostConstruct;

@Configuration
public class MongoConfig {

    @Autowired
    private MongoTemplate mongoTemplate;

    @PostConstruct
    public void initIndexes() {
        TextIndexDefinition textIndex = new TextIndexDefinitionBuilder()
                .onField("name")
                .build();
        mongoTemplate.indexOps(Novel.class).ensureIndex(textIndex);
    }
}