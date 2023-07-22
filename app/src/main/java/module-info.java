module com.example.app {
    requires javafx.controls;
    requires javafx.fxml;
    requires javafx.web;


    opens com.example.app to javafx.fxml;
    exports com.example.app;
}