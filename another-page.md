
<script src="https://cdnjs.cloudflare.com/ajax/libs/pusher/2.1.6/pusher.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/1.11.0/jquery.min.js"></script>









<script>
Pusher.host = 'slanger1.chain.so'; // our server
Pusher.ws_port = 443; // our server's port
Pusher.wss_port = 443; // ...

// create the pusher client connection
var pusher = new Pusher('e9f5cc20074501ca7395', { encrypted: true, disabledTransports: ['sockjs'], disableStats: true });

// subscribe to the channel for address balance updates (new transactions only)
var ticker = pusher.subscribe('address_btc_2MwvxZ3mqpR8iqmbLdGv6CDYPzrbH2Xjtfo');

ticker.bind('balance_update', function(data) {
    if (data.type == "address") {
      // update an HTML div or span with the new content, for e.g.: data.value.balance_change
    }
    });
</script>
