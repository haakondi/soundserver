package server;

import java.net.InetSocketAddress;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.LinkedBlockingQueue;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpServer;

import javafx.application.Application;
import javafx.stage.Stage;

public class Launcher extends Application{
	private static String musicDir;

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		// TODO Auto-generated method stub
		musicDir = args[0];
		Application.launch(Launcher.class, "");

	}

	@Override
	public void start(Stage arg0) throws Exception {
		int port = 3000;
		BlockingQueue<HttpExchange> incoming = new LinkedBlockingQueue<HttpExchange>();
		HttpServer srv = HttpServer.create(new InetSocketAddress(port), 100);
		srv.createContext("/", new Receiver(incoming));
		srv.start();
		System.out.println("HTTP server started on port: " + port);

		(new Thread(new Server(incoming, musicDir))).start();
		
	}

}
