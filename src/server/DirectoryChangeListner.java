package server;
import java.io.IOException;
import java.nio.file.FileSystems;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.WatchKey;
import java.nio.file.WatchService;

import static java.nio.file.StandardWatchEventKinds.*;


public class DirectoryChangeListner implements Runnable{

	private WatchService watcher; 

	public DirectoryChangeListner(String path){
		Path directory = Paths.get(path);
		try {
			watcher = FileSystems.getDefault().newWatchService();
			directory.register(watcher, ENTRY_CREATE, ENTRY_DELETE);
		} catch (IOException e) {
			e.printStackTrace();
		} 
	}
	
	@Override
	public void run() {
		WatchKey key; 
		while (true){
			try {
				key = watcher.take();
				Thread.sleep(200);
				key.pollEvents().size(); 
				key.reset(); 
			} catch (InterruptedException e) {
				e.printStackTrace();
			}
			generateEvent(); 
		}
	}
	
	private void generateEvent(){
		
	}
	
}
