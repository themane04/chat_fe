class api {
  public static readonly messages = 'messages'
}

class ws {
  public static readonly public = '/topic/public';
  public static readonly getMessages = '/app/chat.getMessages';
  public static readonly chatSendMessage = '/app/chat.sendMessage';
  public static readonly chatAddUser = '/app/chat.addUser';
  public static readonly leaveUser = '/app/chat.leaveUser';
}

export class environments {
  public static readonly BACKEND_API_URL = 'http://localhost:8080/api/';
  public static readonly BACKEND_WS_URL = 'ws://localhost:8080/ws';
  public static readonly API = api;
  public static readonly WS = ws;
}
