
class AppMaker {
  constructor () {
    this.server = 'http://parse.sfs.hackreactor.com/chatterbox/classes/messages';
    this.data;
  }
  init() {
    this.fetch();
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
    var renderRoom = this.renderRoom;
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: this.server,
      type: 'GET',
      data: 'order=-createdAt&limit=150',
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Item received');
        this.data = data;
        renderMessage(this.data);
        renderRoom(this.data);
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
  renderMessage(obj) {
    var room = app.currentRoom;
    var messages = obj.results;
    $('.chat').remove();
    for (var i = 0; i < messages.length; i++) {
      if (messages[i].roomname === room) { 
        var user = _.escape(messages[i].username);
        var text = _.escape(messages[i].text);
        $('.chatBox').append('<div class="chat"><a href=# class="username">' + user + '</a><br><span>' + text + '</span></div>');
      }    
    } 
  }
  renderRoom(obj) {
    var messages = obj.results;
    var rooms = [];
    $('.room').remove();
    for (var i = 0; i < messages.length; i++) {
      var room = _.escape(messages[i].roomname);
      if (!rooms.includes(room)) {
        rooms.push(room);
        $('#roomNav').append('<div class="room"><a href=# class="roomLink">' + room + '</a></div>');
      }
    }
  }

  handleUsernameClick() {
    
  }
  
}

let app = new AppMaker();

$(document).ready(function() {
  app.init();
  app.username = "lil prince";
  app.currentRoom = "ghetto";
  
  
  $('.roomBtn').on('click', function() {
    $('.room').fadeToggle();
  });
  
  $('#roomNav').on('click', '.roomLink', function() {
    app.currentRoom = $(this).text();
    app.fetch();
  });
  
  $('.submitBtn').on('click', function() {
    
    var newMessage = {};
    newMessage.username = app.username;
    newMessage.text = $('.messageInput').val();
    $('.messageInput').val('');
    newMessage.roomname = app.currentRoom;
  
    console.log(newMessage.text);
    app.send(newMessage);
    app.fetch();
  });
  
  $('.usernameBtn').on('click', function() {
    app.username = $('.usernameInput').val();
    $('.usernameInput').val('');
    console.log(app.username);
  });
  
  $('.username').on('click', function() {
    addClass('friend');
  });
  
  $('.createRoom').on('click', function() {
    if ($('#roomNav').find('.roomInputCont').length === 0) {
      $('#roomNav').append('<div class="roomInputCont"><input class="roomInput" type="text" placeholder="room name?"><br><span class="addRoom"><a href="#">Submit</a></span></div>'); 
    } else {
      $('.roomInputCont').remove();
    }
  });
  
  $('#roomNav').on('click', '.addRoom', function() {
    var room = $('.roomInput').val();
    $('#roomNav').append('<div class="room"><a href=# class="roomLink">' + room + '</a></div>');
    $('.roomInputCont').remove();
    
  });
});



