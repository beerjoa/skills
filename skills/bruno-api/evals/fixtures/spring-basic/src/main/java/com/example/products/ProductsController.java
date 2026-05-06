package com.example.products;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/products")
public class ProductsController {

  @GetMapping
  public List<Map<String, Object>> listProducts() {
    return List.of(Map.of("id", "product-1", "name", "Widget"));
  }

  @GetMapping("/{id}")
  public Map<String, Object> getProduct(@PathVariable String id) {
    return Map.of("id", id, "name", "Widget");
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public Map<String, Object> createProduct(@RequestBody Map<String, Object> dto) {
    return Map.of("id", "product-2", "name", dto.getOrDefault("name", "New Widget"));
  }

  @DeleteMapping("/{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void deleteProduct(@PathVariable String id) {
  }
}
