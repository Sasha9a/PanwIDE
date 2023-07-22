package com.example.app;

import javafx.application.Application;
import javafx.fxml.FXMLLoader;
import javafx.scene.Scene;
import javafx.scene.web.WebEngine;
import javafx.scene.web.WebView;
import javafx.stage.Stage;

import java.io.IOException;
import java.util.Objects;

public class HelloApplication extends Application {
    @Override
    public void start(Stage stage) throws IOException {
        FXMLLoader fxmlLoader = new FXMLLoader(HelloApplication.class.getResource("hello-view.fxml"));
        stage.setTitle("Demo");
        WebView browser = new WebView();
        WebEngine webEngine = browser.getEngine();
        ClassLoader classLoader = getClass().getClassLoader();
        String s = Objects.requireNonNull(classLoader.getResource("index.html")).toExternalForm();
        System.out.println(s);
        webEngine.load(s);
        Scene scene = new Scene(browser);
        stage.setScene(scene);

        stage.show();
    }

    public static void main(String[] args) {
        launch(args);
    }
}