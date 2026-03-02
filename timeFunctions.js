function sayAloha(){
	setTimeout(function(){
		window.alert("aloha");
	}, 1000);
}

var cb = setInterval(changebackground,1000)
let colors = ["red","white", "blue"]
function changebackground(){
    document.body.style.backgroundColor = colors[Math.floor(Math.random()*colors.length)]
}