
class AppMaker {
  constructor () {
    this.server = 'http://parse.sfs.hackreactor.com/chatterbox/classes/messages';
    this.data;
  }
  init() {
  }
  send(message) {
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: this.server,
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message sent');
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message', data);
      }
    });
  }

  fetch() {
    var renderMessage = this.renderMessage;
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: this.server,
      type: 'GET',
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Item received');
        this.data = data;
        
        for (var i = 0; i < this.data.results.length; i++) {
          renderMessage(this.data.results[i]);
        }
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Item not found:', data);
      }
    });
  }

  clearMessages() {
    $('#chats').children().remove();
  }
  renderMessage(message) {
    $('#chats').append('<div><span>' + message.username + '</span><br><span>' + message.text + '</span></div>');
  }

  renderRoom(room) {
    $('#roomSelect').append('<div>' + room + '</div>');
  }

  handleUsernameClick() {
    
  }
  
}

let app = new AppMaker();

var message = {
  username: 'shawndrost',
  text: 'this actually works',
  roomname: '4chan'
};
app.send(message);
app.fetch();
// app.renderMessage(mess);

