
class AppMaker {
  constructor () {
    this.server = 'http://parse.sfs.hackreactor.com/chatterbox/classes/messages';
    this.data;
    this.friends = [];
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
    if (obj.results) {
      var messages = obj.results;
      $('.chat').remove();
      for (var i = 0; i < messages.length; i++) {
        if (messages[i].roomname === room) { 
          var user = _.escape(messages[i].username);
          var text = _.escape(messages[i].text);
          $('#chats').append('<div class="chat"><a href=# class="username">' + user + '</a><br><span>' + text + '</span></div>');
        }    
      }
    } else {
      if (obj.roomname === room) {
        var user = _.escape(obj.username);
        var text = _.escape(obj.text);
        $('#chats').append('<div class="chat"><a href=# class="username">' + user + '</a><br><span>' + text + '</span></div>');
      }
    }
  }
  renderRoom(obj) {
    var rooms = [];
    if (obj.results) {
      var messages = obj.results;
      $('.room').remove();
      for (var i = 0; i < messages.length; i++) {
        var room = _.escape(messages[i].roomname);
        if (!rooms.includes(room)) {
          rooms.push(room);
          $('#roomNav').append('<div class="room"><a href=# class="roomLink">' + room + '</a></div>');
        }
      }
    } else if (!rooms.includes(obj.roomname)) {
      rooms.push(obj.roomname);
      var room = _.escape(obj.roomname);
      $('#roomNav').append('<div class="room"><a href=# class="roomLink">' + room + '</a></div>');
    }
  }

  handleUsernameClick(username) {
    if (!this.friends.includes(username)) {
      this.friends.push(username);
    } else {
      this.friends(username, 1);
    }
  }
  
}

let app = new AppMaker();

$(document).ready(function() {
  app.init();
  app.username = 'lil prince';
  app.currentRoom = 'lobby';
  
  
  $('.roomBtn').on('click', function(e) {
    e.preventDefault();
    $('.room').fadeToggle();
  });

  $('.friendsBtn').on('click', function(e) {
    e.preventDefault();
    $('.room').fadeToggle();
  });
  
  $('#roomNav').on('click', '.roomLink', function(e) {
    e.preventDefault();
    app.currentRoom = $(this).text();
    app.fetch();
  });
  
  $('.submitBtn').on('click', function(e) {
    e.preventDefault();
    
    var newMessage = {};
    newMessage.username = app.username;
    newMessage.text = $('.messageInput').val();
    $('.messageInput').val('');
    newMessage.roomname = app.currentRoom;
  
    console.log(newMessage.text);
    app.send(newMessage);
    app.fetch();
  });
  
  $('.usernameBtn').on('click', function(e) {
    e.preventDefault();
    app.username = $('.userInput').val();
    $('.userInput').val('');
    console.log(app.username);
  });
  
  $('.createRoom').on('click', function(e) {
    e.preventDefault();
    if ($('#roomNav').find('.roomInputCont').length === 0) {
      $('#roomNav').append('<section class="roomInputCont"><div><input class="roomInput" type="text" placeholder="room name?"></div><div class="addRoom"><a href="#">Submit</a></div></div>'); 
    } else {
      $('.roomInputCont').remove();
    }
  });
  $('.usernameChange').on('click', function(e) {
    e.preventDefault();
    if ($('#roomNav').find('.setUser').length === 0) {
      $('#roomNav').append('<section class="setUser"><div><input class="userInput" type="text" placeholder="user name?"></div><div class="usernameBtn"><a href=#>Submit</a></div></section>'); 
    } else {
      $('.setUser').remove();
    }
  });
  $('#roomNav').on('click', '.usernameBtn', function(e) {
    e.preventDefault();
    var name = $('.userInput').val();
    app.username = name;
    $('.showUserN').html(name);
    $('.setUser').remove();
  });

  $('#roomNav').on('click', '.addRoom', function(e) {
    e.preventDefault();
    var room = $('.roomInput').val();
    $('#roomNav').append('<div class="room"><a href=# class="roomLink">' + room + '</a></div>');
    $('.roomInputCont').remove();
  });

  $('.username').on('click', function(e) {
    e.preventDefault();
    if (!$(this).hasClass('friend')) {
      $(this).addClass('friend');
    } else {
      $(this).removeClass('friend');
    }
  });
});



