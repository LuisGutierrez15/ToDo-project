package com.gupiluan.to_do_backend.utils;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;

public class TestUtils {
    public static String readJSONFile(String path) throws IOException {
        return new String(
                Files.readAllBytes(Paths.get("src/main/resources/testing/" + path)));
    }

}
