package com.gupiluan.to_do_backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Generic pagination wrapper for paginated API responses.
 * Provides metadata about pagination along with the actual page data.
 * 
 * @param <T> the type of data being paginated
 * @author gupiluan
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Pagination<T> {

    /**
     * Human-readable message describing the pagination result.
     */
    private String message;

    /**
     * The actual page data (list of items for current page).
     */
    private T data;

    /**
     * Total number of items across all pages.
     * Useful for calculating total pages and navigation.
     */
    private int total;

    /**
     * Current page number (0-based).
     */
    private int page;

    /**
     * Number of items per page.
     */
    private int size;

    /**
     * Total number of pages available.
     */
    private int totalPages;

    /**
     * Factory method for creating paginated responses.
     * 
     * @param <T>   the type of data
     * @param data  the page data
     * @param page  current page number (0-based)
     * @param size  items per page
     * @param total total items across all pages
     * @return Pagination wrapper with calculated metadata
     */
    public static <T> Pagination<T> of(T data, int page, int size, int total) {
        String message = total > 0 ? "Data retrieved successfully" : "No data found";
        int totalPages = size > 0 ? (int) Math.ceil((double) total / size) : 0;

        Pagination<T> pagination = new Pagination<>();
        pagination.setMessage(message);
        pagination.setData(data);
        pagination.setTotal(total);
        pagination.setPage(page);
        pagination.setSize(size);
        pagination.setTotalPages(totalPages);

        return pagination;
    }
}
