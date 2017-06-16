<%@ page language="java" contentType="text/html; charset=UTF-8"
 pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>

 
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Insert title here</title>
</head>
<body>
 
<script type="text/javascript">
 

 
 var uriWS="ws://localhost:8080/StoryFile/storyfile";
 var miWebsocket= new WebSocket(uriWS);
 console.log (miWebsocket);
 
 miWebsocket.onopen=function(evento) {
 console.log("abierto");
 miWebsocket.send(null);
 } 
 
 miWebsocket.onmessage=function(evento) {
 console.log("onmessage");
 console.log(evento);
 }
 

</script>
</body>
</html>