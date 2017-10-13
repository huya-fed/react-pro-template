/*
 * Copyright (c) 2010 Animesh Kumar  (https://github.com/anismiles)
 * Copyright (c) 2010 Strumsoft  (https://strumsoft.com)
 *  
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *  
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *  
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 *  
 */

// if (!!window.WebSocket && window.WebSocket.prototype.send) {
//     //supported
// }else {
// 	//not supported

(function() {

	if (!!window.kwWebSocket) {
		return;
	}

	// window.output = function(text) {
	// 	var div = document.createElement("div");
	// 	div.innerHTML = text;
	// 	document.getElementsByTagName('body')[0].appendChild(div);
	// }

	// window.onerror = function(err) {
	// 	output(err);
	// }

	window.kwWebSocket = true;
	
	// window object
	var global = window;
	
	// WebSocket Object. All listener methods are cleaned up!
	var WebSocket = global.WebSocket = function(url) {
		// get a new websocket object from factory (check com.strumsoft.websocket.WebSocketFactory.java)
		this.socket = WebSocketFactory.getInstance(url);
		// store in registry
		if(this.socket) {
			WebSocket.store[this.socket.getId()] = this;
		} else {
			throw new Error('Websocket instantiation failed! Address might be wrong.');
		}
	};

	// storage to hold websocket object for later invokation of event methods
	WebSocket.store = {};

	var useBlobBuilder = false;
	var array = new Int8Array([17, -45.3]);

	window.BlobBuilder = window.BlobBuilder || 
	                     window.WebKitBlobBuilder || 
	                     window.MozBlobBuilder || 
	                     window.MSBlobBuilder;

	try {
	  var jpeg = new Blob( [array], {type : "image/jpeg"});
	} catch(e){
	    useBlobBuilder = true;
	}

	function _base64ToArraybuffer(base64) {
		
	    var binary_string = window.atob(base64);
	    var len = binary_string.length;
	    var bytes = new Uint8Array( len );
	    for (var i = 0; i < len; i++)        {
	        bytes[i] = binary_string.charCodeAt(i);
	    }
	    return bytes.buffer;
	}

	
	// static event methods to call event methods on target websocket objects
	function _base64ToBlob(base64) {
		
	    var binary_string = window.atob(base64);
	    var len = binary_string.length;
	    var bytes = new Uint8Array( len );
	    for (var i = 0; i < len; i++)        {
	        bytes[i] = binary_string.charCodeAt(i);
	    }

	    var result;

		try {
			result = new Blob([bytes.buffer]);
		}
		catch(e){

		    // TypeError old chrome and FF
		    window.BlobBuilder = window.BlobBuilder ||
		                         window.WebKitBlobBuilder ||
		                         window.MozBlobBuilder ||
		                         window.MSBlobBuilder;

	        result = new BlobBuilder();
	        result.append([bytes.buffer]);
	        result = result.getBlob();
		}

	    return result;
	}


	function _arrayBufferToBase64(buffer) {
		var binary = '';
	    var bytes = new Uint8Array( buffer );
	    var len = bytes.byteLength;
	    for (var i = 0; i < len; i++) {
	        binary += String.fromCharCode( bytes[ i ] );
	    }
	   return window.btoa( binary );
	}

	WebSocket.__onmessage = function (evt , type) {

		if (type === "string") {

		} else {
			if (evt.data) {
				evt.data = _base64ToArraybuffer(evt.data);
			};
		}

		WebSocket.onmessage(evt);
	}

	WebSocket.onmessage = function (evt) {
		WebSocket.store[evt._target]['onmessage'].call(global, evt);
	}	
	
	WebSocket.onopen = function (evt) {
		WebSocket.store[evt._target]['onopen'].call(global, evt);
	}
	
	WebSocket.onclose = function (evt) {
		WebSocket.store[evt._target]['onclose'].call(global, evt);
	}
	
	WebSocket.onerror = function (evt) {
		WebSocket.store[evt._target]['onerror'].call(global, evt);
	}

	// instance event methods
	WebSocket.prototype.send = function(data) {
		
		if (data instanceof ArrayBuffer) {

			this.socket.send(_arrayBufferToBase64(data),"arraybuffer");

		} else if (data instanceof Blob) {

			var self = this;
			var reader = new FileReader();
			reader.onload = function(event){

				if (this.result instanceof ArrayBuffer) {
					self.socket.send(this.result,"arraybuffer");
				} 
				
			}; 
			var source = reader.readAsArrayBuffer(data);

		} else if(typeof(data) === "string") {

			this.socket.send(data , "string");
		}
	}

	WebSocket.prototype.close = function() {
		this.socket.close();
	}
	
	WebSocket.prototype.getReadyState = function() {
		this.socket.getReadyState();
	}
	///////////// Must be overloaded
	WebSocket.prototype.onopen = function(){
		throw new Error('onopen not implemented.');
    };
    
    // alerts message pushed from server
    WebSocket.prototype.onmessage = function(msg){
    	throw new Error('onmessage not implemented.');
    };
    
    // alerts message pushed from server
    WebSocket.prototype.onerror = function(msg){
    	throw new Error('onerror not implemented.');
    };
    
    // alert close event
    WebSocket.prototype.onclose = function(){
        throw new Error('onclose not implemented.');
    };
})();

// }

