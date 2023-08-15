package com.example.app;

import javafx.application.Application;
import javafx.scene.Scene;
import javafx.scene.web.WebView;
import javafx.stage.Stage;

public class HelloApplication extends Application {
    @Override
    public void start(Stage stage) {
        stage.setTitle("Demo");
        WebView browser = new WebView();
        browser.getEngine().load(getClass().getResource("index.html").toString());
        Scene scene = new Scene(browser);
        stage.setScene(scene);

        stage.show();
    }

    public static void main(String[] args) {
        launch(args);
    }
}