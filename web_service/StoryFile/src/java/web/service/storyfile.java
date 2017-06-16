/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package web.service;


import com.ibm.watson.developer_cloud.http.HttpMediaType;
import com.ibm.watson.developer_cloud.speech_to_text.v1.SpeechToText;
import com.ibm.watson.developer_cloud.speech_to_text.v1.model.RecognizeOptions;
import com.ibm.watson.developer_cloud.speech_to_text.v1.model.SpeechAlternative;
import com.ibm.watson.developer_cloud.speech_to_text.v1.model.SpeechResults;
import com.ibm.watson.developer_cloud.speech_to_text.v1.model.Transcript;
import com.ibm.watson.developer_cloud.speech_to_text.v1.websocket.BaseRecognizeCallback;
import com.ibm.watson.developer_cloud.text_to_speech.v1.util.WaveUtils;

import com.sun.media.sound.WaveFileWriter;
import java.io.BufferedInputStream;
import java.io.ByteArrayInputStream;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.StringReader;
import java.net.HttpURLConnection;
import java.nio.ByteBuffer;
import java.nio.ByteOrder;
import java.nio.ShortBuffer;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.sound.sampled.AudioFileFormat;
import javax.sound.sampled.AudioInputStream;
import javax.sound.sampled.AudioSystem;
import javax.sound.sampled.UnsupportedAudioFileException;
import javax.websocket.OnError;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.server.ServerEndpoint;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.UriInfo;
import javax.ws.rs.Produces;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PUT;
import javax.ws.rs.core.MediaType;
import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.List;
import java.util.stream.Collectors;
import javax.json.Json;
import javax.json.JsonObject;
import javax.json.JsonReader;
import javax.sound.sampled.AudioFormat;

import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import net.sourceforge.jaad.aac.AACException;
import net.sourceforge.jaad.aac.Decoder;
import net.sourceforge.jaad.aac.SampleBuffer;
import net.sourceforge.jaad.adts.ADTSDemultiplexer;



import org.apache.commons.codec.binary.Base64;
import org.apache.commons.io.FileUtils;
import org.apache.commons.io.IOUtils;
/**
 * REST Web Service
 *
 * @author jeanm
 */
//@Path("web.service")
@ServerEndpoint("/storyfile")
public class storyfile {
 SpeechToText service = new SpeechToText();
  RecognizeOptions options;
  int sampleRate = 16000;
  WaveFloatFileReader wf;
  final String ORIGINAL_SERVICE_URL = "https://stream.watsonplatform.net/speech-to-text/api";
    final String API_PATH = "/v1/recognize";
    final String SERVICE_NAME = "speech_to_text";
    final String XML_DEC = "<?xml version='1.0' encoding='UTF-8'?>";
    final String STATUS_OK = "<status>OK</status>";
    final String STATUS_ERROR = "<status>ERROR</status>";
  private static CountDownLatch lock = new CountDownLatch(1);
    @Context
    private UriInfo context;

    /**
     * Creates a new instance of storyfile
     */
    public storyfile() {
    }

    /**
     * Retrieves representation of an instance of web.service.storyfile
     * @return an instance of java.lang.String
     */
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public String getJson(String nombre) {
        //TODO return proper representation object
        return "Hola";
    }

    /**
     * PUT method for updating or creating an instance of storyfile
     * @param content representation for the resource
     */
    @PUT
    @Consumes(MediaType.APPLICATION_JSON)
    public String putJson(String content) {
       return "Hola: "+content;
    }
    
    @OnOpen
    public void open(){
        System.out.println("Ws: Connected");
     try {
         outStream = new FileOutputStream(targetFile);
     } catch (FileNotFoundException ex) {
         Logger.getLogger(storyfile.class.getName()).log(Level.SEVERE, null, ex);
     }
         service.setUsernameAndPassword("b5bbbcad-d720-4847-8a74-019e06cd8c1f", "lEvUY83Fx25c");
    }
    
    
    
    
   HttpURLConnection conn = null;
    @OnMessage
    public String send(InputStream audio) throws InterruptedException, AACException
    
    {
        
       // WaveUtils.reWriteWaveHeader(audio);
//        this.audio = audio;
//          try {
//              whenConvertingInProgressToFile_thenCorrect();
//              /*    ShortBuffer sbuf =
//              ByteBuffer.wrap(audioBytes).order(ByteOrder.LITTLE_ENDIAN).asShortBuffer();
//              short[] audioShorts = new short[sbuf.capacity()];
//              sbuf.get(audioShorts);
//              float[] audioFloats = new float[audioShorts.length];
//              for (int i = 0; i < audioShorts.length; i++) {
//              audioFloats[i] = ((float)audioShorts[i])/0x8000;
//              }*/
//          } catch (IOException ex) {
//              Logger.getLogger(storyfile.class.getName()).log(Level.SEVERE, null, ex);
//          }
        
        // remove the "data:audio/x-wav;base64" header
        //ADTSDemultiplexer adts = new ADTSDemultiplexer(new FileInputStream(base64));
//        Decoder dec = new Decoder(base64);
//        SampleBuffer buf = new SampleBuffer();
//        byte[] b;
//        dec.decodeFrame(base64, buf);
//        //the aacFrame array contains the AAC frame to decode
//        byte[] audioBytes = buf.getData(); //this array contains the raw PCM audio data
        
//        byte[] wavBytes = javax.xml.bind.DatatypeConverter.parseBase64Binary(base64);
//        // Save the audio byte[] to a wav file
//        String result = "";
//        File soundFile = null;
//        try {
//            System.out.println("Have speech file, creating temp file to send to Watson");
//            //System.out.println("Using these keywords:" + keywords);
//            soundFile = File.createTempFile("voice", ".wav");
//           FileUtils.writeByteArrayToFile(soundFile, wavBytes);
        
            // Transcribe the wav file using Watson's recognize() API
//            try {
//                if (soundFile.exists()) {
//                    System.out.println("Sound file exists!");
//                    options = new RecognizeOptions.Builder()
//                            
//                            .continuous(true)
//                            .interimResults(true)
//                            .contentType(HttpMediaType.AUDIO_BASIC)
//                            
//                            .build();
//            SpeechResults execute = service.recognize(soundFile, options).execute();
//            System.out.println(execute.);
//List < Transcript > transcripts = service.recognize(soundFile, options).execute().getResults();
//
//System.out.println("Got some results!");
//for (Transcript transcript: transcripts) {
//    for (SpeechAlternative alternative: transcript.getAlternatives()) {
//        result = alternative.getTranscript() + " ";
//        System.out.println("result:" + result);
//    }
//}
//return "ok";
//                } else {
//                    return ("Sound file could not be saved to server");
//                }
//            } catch (Exception e) {
//                e.printStackTrace();
//                
//            }
//        } catch (IOException e) {
//            System.out.println("No audio file received");
//            e.printStackTrace();
//            return ("No audio file received");
//        }
        
//        if (incomingBinaryPOSTData.length == 0) {
//                return "audio 0";
//            }
//
//         
//     try {
//         conn = setupHttpConnection(incomingBinaryPOSTData);
//         // make the connection
//            conn.connect();
//            
//            sendRequest(incomingBinaryPOSTData, conn);
//            
//            readJsonObject(new StringReader(readResponse(conn)));
//            
//     } catch (IOException ex) {
//         Logger.getLogger(storyfile.class.getName()).log(Level.SEVERE, null, ex);
//     }
//AudioFormat af;
       // InputStream audio = new ByteArrayInputStream(audioBytes);
     
        
           options = new RecognizeOptions.Builder()
                 
                 .continuous(true)
                 .interimResults(true)
                 .contentType(HttpMediaType.AUDIO_WAV)
                 
                 .build();
         service.recognizeUsingWebSocket(audio, options, new BaseRecognizeCallback(){
             @Override
             public void onTranscription(SpeechResults speechResults) {
                 System.out.println(speechResults);
                 if (speechResults.isFinal())
                 {
                     lock.countDown();
                 }
             }
             
         });
         //System.out.println(String.valueOf(audio.read()));
         lock.await(1, TimeUnit.SECONDS);
    return "listo";

    }
    
    @OnMessage
    public String send(String audio){
    
        System.out.println("enviando watson..");
         options = new RecognizeOptions.Builder()
                 
                 .continuous(true)
                 .interimResults(true)
                 .contentType("audio/l16; rate=48000")
                 
                 .build();
     SpeechResults execute = service.recognize(targetFile, options).execute();
        System.out.println(execute);
     return "Hola: "+audio;
    }

   private HttpURLConnection setupHttpConnection(byte[] incomingBinaryPOSTData) throws IOException
   {
       //service.setUsernameAndPassword("b5bbbcad-d720-4847-8a74-019e06cd8c1f", "lEvUY83Fx25c");
       String serviceUser = "b5bbbcad-d720-4847-8a74-019e06cd8c1f";
        String servicePass = "lEvUY83Fx25c";
        String auth = serviceUser + ":" + servicePass;
       String queryString = "&model=en-US_NarrowbandModel"
                + "&continuous=true";
       System.out.println("POSTing [" + incomingBinaryPOSTData.length + "] bytes");
            //System.out.println("Using URL [" + serviceURL + API_PATH + "?" + queryString + "]");
            // Prepare the HTTP connection to the service
        HttpURLConnection conn = openConnectionWithURL("https://stream.watsonplatform.net/speech-to-text/api", queryString);
        conn.setDoInput(true);
        conn.setDoOutput(true);
        conn.setRequestMethod("POST");
        conn.setRequestProperty("Authorization", "Basic " + Base64.encodeBase64String(auth.getBytes()));
        conn.setRequestProperty("Accept", "*/*");
        conn.setRequestProperty("Content-Type", "audio/flac");
        conn.setRequestProperty("Transfer-encoding", "chunked");
        conn.setFixedLengthStreamingMode(incomingBinaryPOSTData.length);

        // Uncomment the following to opt out of improving the service with this audio file
        //	    conn.setRequestProperty("X-WDC-PL-OPT-OUT", "1");
        return conn;
   }
   
    private void sendRequest(byte[] incomingBinaryPOSTData, HttpURLConnection conn) throws IOException {
        OutputStream output = conn.getOutputStream();
        output.write(incomingBinaryPOSTData);
        output.flush();
        output.close();
    }
    
    private HttpURLConnection openConnectionWithURL(String serviceURL, String queryString) throws IOException {
        return (HttpURLConnection) new URL(serviceURL + API_PATH /*+ "?" + queryString*/).openConnection();
    }

     
     private JsonObject readJsonObject(StringReader source) throws IOException {
        JsonReader jReader = (JsonReader) Json.createReader(source);
        javax.json.JsonObject jObject = jReader.readObject();
        jReader.close();
        return jObject;
    }
     
      private String readResponse(HttpURLConnection conn) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(conn.getInputStream(), "UTF-8"));

       
            System.out.println("Service response code: " + conn.getResponseCode());
            System.out.println("Service response message: " + conn.getResponseMessage());
        

        String lines = br.lines().collect(Collectors.joining("\n"));
        br.close();

        System.out.println("Service response body:\n" + lines);

        return lines;
    }
      
      InputStream audio;
       File targetFile= new File("targetFile.wav");
       OutputStream outStream;
private void whenConvertingInProgressToFile_thenCorrect() 
  throws IOException {
  
//    InputStream initialStream = new FileInputStream(
//      new File("src/main/resources/sample.txt"));
//    targetFile = new File("targetFile.wav");
     outStream = new FileOutputStream(targetFile);
 
    byte[] buffer = new byte[8 * 1024];
    int bytesRead;
    while ((bytesRead = audio.read(buffer)) != -1) {
        outStream.write(buffer, 0, bytesRead);
    }
    IOUtils.closeQuietly(audio);
    IOUtils.closeQuietly(outStream);
}
}
