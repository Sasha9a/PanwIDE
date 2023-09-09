module com.ide.app {
    requires javafx.controls;
    requires javafx.fxml;


    opens com.ide.app to javafx.fxml;
    exports com.ide.app;
}