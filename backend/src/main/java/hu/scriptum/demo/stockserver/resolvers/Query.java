package hu.scriptum.demo.stockserver.resolvers;

import com.coxautodev.graphql.tools.GraphQLQueryResolver;
import org.springframework.stereotype.Component;

@Component
class Query implements GraphQLQueryResolver {

    public String hello() {
        return "Hello world!";
    }

}
