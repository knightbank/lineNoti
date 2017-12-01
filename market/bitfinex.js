const request = require('request')

function getTicker(currency) {
	var url = "https://api.bitfinex.com/v1/pubticker/"+currency;
	request({
		url: url,
		json: true
	}, function (error, response, body) {

		if (!error && response.statusCode === 200) {
			//console.log(body); // Print the json response
			//console.log(JSON.stringify(body));
			processTicker(currency.toUpperCase(),body);
		}
	})
}//end function

//example {"mid":"9877.75","bid":"9877.3","ask":"9878.2","last_price":"9877.3","low":"9450.5","high":"9941.3","volume":"46038.02623379","timestamp":"1511885220.2277088"}
function processTicker(symbol,jsonTicker) {
	var lastPrice = jsonTicker["last_price"];
	var highPrice = jsonTicker["high"];
	var lowPrice = jsonTicker["low"];
	var volume = jsonTicker["volume"];
	var timestamp = jsonTicker["timestamp"];
	var fallPct=((lastPrice-highPrice)*100/highPrice).toFixed(4);
	var raisePct=((lastPrice-lowPrice)*100/lowPrice).toFixed(4);
	var text="";
	/*
	*Get Date Time From Timestamp
	*/
	// Create a new JavaScript Date object based on the timestamp
	// multiplied by 1000 so that the argument is in milliseconds, not seconds.
	var datetime = new Date(timestamp*1000);
	// Hours part from the timestamp
	var hours = datetime.getHours();
	// Minutes part from the timestamp
	var minutes = "0" + datetime.getMinutes();
	// Seconds part from the timestamp
	var seconds = "0" + datetime.getSeconds();
	/*
	*Panic signal
	*If Last price falling from High Price 2% SendNotify()
	*/
	if(fallPct<=-2){
		text = symbol+" Last Price falling from High Price(in 24Hr.) to "+fallPct+" %\n"+
		"Last Price : "+lastPrice+"\n"+
		"High Price : "+highPrice+"\n"+
		"Low Price : "+lowPrice+"\n"
		SendNotify(text,2,24)
	}
	/*
	*at the bottom signal
	*If Last price raising from Low Price 2% SendNotify()
	*/
	if(raisePct>=2){
		text = symbol+" Last Price raising from Low Price(in 24Hr.) to "+raisePct+" %\n"+
		"Last Price : "+lastPrice+"\n"+
		"High Price : "+highPrice+"\n"+
		"Low Price : "+lowPrice+"\n"
		SendNotify(text,2,171)
	}
	/*
	*report every 30 minute
	*/
	if((minutes==30||minutes==00)&&seconds<=15){
		text= "30 Minutes Report \n"+
		datetime.toISOString().slice(0, 10)+"\n"+
		"bitfinex."+symbol+" \n"+
		"Last Price : "+lastPrice+"\n"+
		"High Price : "+highPrice+"\n"+
		"Low Price : "+lowPrice+"\n"+
		"%Change : "+fallPct+"% \n"+
		"Volume : "+volume+"\n"
		SendNotify(text,2,514,true)
	}

}//end function