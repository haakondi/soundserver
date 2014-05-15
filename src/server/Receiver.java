package server;

import java.util.concurrent.BlockingQueue;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;

public class Receiver implements HttpHandler{
	private final BlockingQueue<HttpExchange> incoming;

	public Receiver(BlockingQueue<HttpExchange> incoming) {
		super();
		this.incoming = incoming;
	}

	@Override
	public void handle(HttpExchange exchange) {
		
		incoming.offer(exchange);
		
	}
	
	
}
