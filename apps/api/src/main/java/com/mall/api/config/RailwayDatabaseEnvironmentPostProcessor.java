package com.mall.api.config;

import java.net.URI;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.env.EnvironmentPostProcessor;
import org.springframework.core.Ordered;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.MapPropertySource;
import org.springframework.util.StringUtils;

public class RailwayDatabaseEnvironmentPostProcessor implements EnvironmentPostProcessor, Ordered {

    private static final String PROPERTY_SOURCE_NAME = "railwayDatabaseProperties";

    @Override
    public void postProcessEnvironment(ConfigurableEnvironment environment, SpringApplication application) {
        Map<String, Object> datasourceProperties = new LinkedHashMap<>();

        addJdbcDatabaseUrl(environment, datasourceProperties);
        if (datasourceProperties.isEmpty()) {
            addPostgresDatabaseUrl(environment, datasourceProperties);
        }
        if (datasourceProperties.isEmpty()) {
            addPostgresVariableUrl(environment, datasourceProperties);
        }

        if (!datasourceProperties.isEmpty()) {
            environment.getPropertySources().remove(PROPERTY_SOURCE_NAME);
            environment.getPropertySources().addFirst(
                    new MapPropertySource(PROPERTY_SOURCE_NAME, datasourceProperties));
        }
    }

    @Override
    public int getOrder() {
        return Ordered.HIGHEST_PRECEDENCE + 20;
    }

    private void addJdbcDatabaseUrl(ConfigurableEnvironment environment, Map<String, Object> properties) {
        String jdbcUrl = firstNonBlank(environment, "JDBC_DATABASE_URL", "SPRING_DATASOURCE_URL");
        if (!StringUtils.hasText(jdbcUrl)) {
            return;
        }

        properties.put("spring.datasource.url", jdbcUrl);
        putIfPresent(properties, "spring.datasource.username",
                firstNonBlank(environment, "JDBC_DATABASE_USERNAME", "SPRING_DATASOURCE_USERNAME"));
        putIfPresent(properties, "spring.datasource.password",
                firstNonBlank(environment, "JDBC_DATABASE_PASSWORD", "SPRING_DATASOURCE_PASSWORD"));
    }

    private void addPostgresDatabaseUrl(ConfigurableEnvironment environment, Map<String, Object> properties) {
        String databaseUrl = firstNonBlank(environment, "DATABASE_URL", "POSTGRES_URL");
        if (!StringUtils.hasText(databaseUrl)) {
            return;
        }

        URI uri = parseDatabaseUri(databaseUrl);
        String scheme = uri.getScheme();
        if (!"postgres".equalsIgnoreCase(scheme) && !"postgresql".equalsIgnoreCase(scheme)) {
            throw new IllegalStateException("Unsupported DATABASE_URL scheme: " + scheme);
        }

        StringBuilder jdbcUrl = new StringBuilder("jdbc:postgresql://");
        jdbcUrl.append(uri.getHost());
        if (uri.getPort() > 0) {
            jdbcUrl.append(':').append(uri.getPort());
        }
        if (StringUtils.hasText(uri.getRawPath())) {
            jdbcUrl.append(uri.getRawPath());
        }
        if (StringUtils.hasText(uri.getRawQuery())) {
            jdbcUrl.append('?').append(uri.getRawQuery());
        }

        properties.put("spring.datasource.url", jdbcUrl.toString());
        addUserInfo(uri, properties);
    }

    private void addPostgresVariableUrl(ConfigurableEnvironment environment, Map<String, Object> properties) {
        String host = firstNonBlank(environment, "PGHOST", "POSTGRES_HOST");
        if (!StringUtils.hasText(host)) {
            return;
        }

        String port = defaultIfBlank(firstNonBlank(environment, "PGPORT", "POSTGRES_PORT"), "5432");
        String database = defaultIfBlank(firstNonBlank(environment, "PGDATABASE", "POSTGRES_DB"), "mall_system");
        String username = firstNonBlank(environment, "PGUSER", "POSTGRES_USER");
        String password = firstNonBlank(environment, "PGPASSWORD", "POSTGRES_PASSWORD");
        String sslMode = firstNonBlank(environment, "PGSSLMODE", "POSTGRES_SSLMODE");

        StringBuilder jdbcUrl = new StringBuilder("jdbc:postgresql://")
                .append(host)
                .append(':')
                .append(port)
                .append('/')
                .append(database);
        if (StringUtils.hasText(sslMode)) {
            jdbcUrl.append("?sslmode=").append(sslMode);
        }

        properties.put("spring.datasource.url", jdbcUrl.toString());
        putIfPresent(properties, "spring.datasource.username", username);
        putIfPresent(properties, "spring.datasource.password", password);
    }

    private URI parseDatabaseUri(String databaseUrl) {
        try {
            return URI.create(databaseUrl);
        } catch (IllegalArgumentException ex) {
            throw new IllegalStateException("Invalid DATABASE_URL value", ex);
        }
    }

    private void addUserInfo(URI uri, Map<String, Object> properties) {
        String userInfo = uri.getRawUserInfo();
        if (!StringUtils.hasText(userInfo)) {
            return;
        }

        String[] credentials = userInfo.split(":", 2);
        putIfPresent(properties, "spring.datasource.username", decode(credentials[0]));
        if (credentials.length > 1) {
            putIfPresent(properties, "spring.datasource.password", decode(credentials[1]));
        }
    }

    private String firstNonBlank(ConfigurableEnvironment environment, String... names) {
        for (String name : names) {
            String value = environment.getProperty(name);
            if (StringUtils.hasText(value)) {
                return value;
            }
        }
        return null;
    }

    private String defaultIfBlank(String value, String defaultValue) {
        return StringUtils.hasText(value) ? value : defaultValue;
    }

    private void putIfPresent(Map<String, Object> properties, String key, String value) {
        if (StringUtils.hasText(value)) {
            properties.put(key, value);
        }
    }

    private String decode(String value) {
        return URLDecoder.decode(value, StandardCharsets.UTF_8);
    }
}
