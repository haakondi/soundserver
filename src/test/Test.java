package test;

import javafx.application.Application;
import javafx.stage.Stage;

public class Test extends Application{

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		Application.launch(Test.class, "arg");
	}

	@Override
	public void start(Stage arg0) throws Exception {
		System.out.println("hei");
		
		
	}

}
