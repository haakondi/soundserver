package server;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.List;
import java.util.concurrent.BlockingQueue;

import org.apache.commons.io.IOUtils;
import org.json.JSONObject;

import com.sun.net.httpserver.HttpExchange;

public class Server implements Runnable {

	private final BlockingQueue<HttpExchange> incoming;
	private final Player player;

	public Server(BlockingQueue<HttpExchange> incoming, String musicDir) {
		super();
		this.incoming = incoming;
		this.player = new Player(musicDir);
	}

	private String determineContentType(String filename) {
		if (filename.endsWith(".js"))
			return "content-type:application/javascript";
		if (filename.endsWith(".css"))
			return "content-type:application/css";

		return "content-type:application/html";
	}

	public Response respondFile(String path) {
		File file = new File("www/" + path);
		byte[] data = null;
		int code = 200;

		try {
			data = IOUtils.toByteArray(new FileInputStream(file));
		} catch (FileNotFoundException e) {
			// TODO Auto-generated catch block
			code = 404;
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			code = 500;
			e.printStackTrace();
		}
		return new Response(data, determineContentType(path), code);

	}

	@Override
	public void run() {
		while (true) {
			try {
				Response response = null;
				HttpExchange msg = incoming.take();
				if(msg.getRequestMethod().equalsIgnoreCase("POST")){
					JSONObject requestJSON = new JSONObject(IOUtils.toString(msg.getRequestBody()));
					System.out.println(requestJSON);					
					response = processMessage(requestJSON.getJSONObject(Constants.commandContainer));
				}
				else{
					response = respondFile(msg.getRequestURI().toString());
					
				}

				// JSONObject response =



				respond(msg, response);
			} catch (InterruptedException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}catch(Exception e){
				System.out.println("Server exception. Should not have bubbled this high!!");
				e.printStackTrace();
			}
		}
	}

	public Response processMessage(JSONObject jsonCommand) {
		String command = jsonCommand.getString("command");
		JSONObject outgoing = new JSONObject();
		// String command = ((String) msg.get("command"));
		if (command == null)
			return new Response(null, null, 500);

		if (command.equalsIgnoreCase("PLAY_NEW")) {
			player.playNewSong(jsonCommand.getInt(Constants.songID));
		}
		if (command.equalsIgnoreCase("queue")) {
			player.queue(jsonCommand.getInt(Constants.songID));
		}
		if (command.equalsIgnoreCase("pause")) {
			player.pause();
		}
		if (command.equalsIgnoreCase("resume")) {
			player.resume();
		}
		if (command.equalsIgnoreCase("set_volume")) {
			 player.setVolume(jsonCommand.getDouble(Constants.volume));
		}
		if (command.equalsIgnoreCase("list_songs")) {
			JSONObject songs = new JSONObject();
			List<Song> songList = player.getSongs();
			songs.put("length", songList.size());
			for (int i = 0; i < songList.size(); i++) {
				songs.put(Integer.toString(i), songList.get(i).toJSON());
			}
			outgoing.put(Constants.songList, songs);
		}
		if (command.equalsIgnoreCase("stop")) {
			player.stop();
		}
		
		outgoing.put(Constants.status, generateStatus());
		return new Response(outgoing.toString().getBytes(), "content-type:application/json", 200);
	}
	
	public JSONObject generateStatus(){
		JSONObject status = new JSONObject();
		status.put(Constants.songIDPlaying, player.getSongPlaying());
		status.put(Constants.volume, player.getVolume());
		status.put(Constants.time, player.getTimeInSeconds());
		return status;
		
	}

	public void respond(HttpExchange exchange, Response response) {
		try {
			exchange.sendResponseHeaders(response.responseCode,
					response.getResponseLength());
			if (response.getResponseLength() > 0) {
				exchange.getResponseBody().write(response.data);
			}
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		exchange.close();
	}

}
