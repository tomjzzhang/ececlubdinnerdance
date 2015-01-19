io.socket.on('connect', function messageReceived() {
	console.log(this.socket.sessionid);

	// Respond to user events.  You can always safely use the 
	// global `io.socket` to bind event handlers
	io.socket.on('user', function (message) {
		if (message.verb == 'updated') {
			//delete the user
			
			var oldEntry = $('#user-'+message.id);
			if (oldEntry){
				var oldTable = oldEntry.parent().attr('id');
				if (oldTable){
					var oldTableNum = oldTable.match(/\d+/)[0] 

					var btn = $('#table-'+ oldTableNum + '-btn');
					if (btn.text().trim() == 'Full'){
						btn.text("Add");
						btn.css("pointer-events", "auto");
					}
				}
				oldEntry.remove();
			}
			
			if (message.data.tableNum){
				//if user was added to table
				var list = $('#table-'+message.data.tableNum);
				var userElement = $('<li id="user-' + message.id + '">'+ message.data.name +'</li>');
				list.append(userElement);

				var numSeats = list.children().length;
				if ((message.data.tableNum <= 2 && numSeats >= 12 )|| (message.data.tableNum > 2 && numSeats >= 10 )){
					var btn = $('#table-'+message.data.tableNum + '-btn');
					btn.text("Full");
					btn.css("pointer-events", "none");
				}
			}
      	}
	});

	// Get the users and just spit them out to the console.  This will also
	// subscribe the socket to any events involving the returned users, which 
	// will then be handled by the `io.socket.on` code above.
	io.socket.get('/tables/subscribe', function (response){
		console.log(response);
	});

});