package com.gupiluan.to_do_backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Generic API response wrapper for consistent response format across all
 * endpoints.
 * Provides standardized structure for both success and error responses.
 * 
 * @param <T> the type of data being returned in the response
 * @author gupiluan
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApiResponse<T> {

    /**
     * Human-readable message describing the result of the operation.
     * Should provide meaningful feedback to the client.
     */
    private String message;

    /**
     * The actual data payload of the response.
     * Can be null in case of errors or when no data is returned.
     */
    private T data;

    /**
     * Factory method for creating successful responses.
     * 
     * @param <T>  the type of data
     * @param data the response data
     * @return ApiResponse with success message
     */
    public static <T> ApiResponse<T> success(T data) {
        return new ApiResponse<>("Operation completed successfully", data);
    }

    /**
     * Factory method for creating successful responses with custom message.
     * 
     * @param <T>     the type of data
     * @param message custom success message
     * @param data    the response data
     * @return ApiResponse with custom success message
     */
    public static <T> ApiResponse<T> success(String message, T data) {
        return new ApiResponse<>(message, data);
    }

    /**
     * Factory method for creating error responses.
     * 
     * @param <T>     the type of data
     * @param message error message
     * @return ApiResponse with error message and null data
     */
    public static <T> ApiResponse<T> error(String message) {
        return new ApiResponse<>(message, null);
    }
}
