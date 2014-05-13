package server;

public class Response {

	public final byte[] data;
	public final String contentType;
	public final int responseCode;
	public Response(byte[] data, String contentType, int responseCode) {
		super();
		this.data = data;
		this.contentType = contentType;
		this.responseCode = responseCode;
	}
	
	public int getResponseLength(){
		if(data == null)
			return 0;
		return data.length;
	}
	
	

}
