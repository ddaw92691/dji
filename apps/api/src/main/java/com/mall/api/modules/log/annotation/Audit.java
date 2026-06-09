package com.mall.api.modules.log.annotation;

import java.lang.annotation.*;

@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface Audit {
    String module() default "";
    String action() default "";
    String description() default "";
}
