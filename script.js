$(function() {
    var dropdown;
    var voices;

    window.speechSynthesis.onvoiceschanged = function() {
        voices = window.speechSynthesis.getVoices();

        dropdown = document.getElementById("voiceList");
        if (dropdown.length == 0) {
            for (var i = 0; i < voices.length; i++) {
                var option = document.createElement('option');
                option.value = i;
                option.text = voices[i].name + " " + voices[i].lang;
                dropdown.add(option, 0);
            }
        }
        dropdown.selectedIndex = 63;
        window.speechSynthesis.onvoiceschanged = null;
    };


    function speakWord(word) {
        speaking = true;
        var msg = new SpeechSynthesisUtterance();

        msg.voiceURI = 'native';
        msg.volume = 1; // 0 to 1

        var val = dropdown.options[dropdown.selectedIndex].value;

        msg.voice = voices[val];
        msg.rate = document.getElementById("rate").value; // 0.1 to 10
        msg.pitch = document.getElementById("pitch").value; //0 to 2
        msg.text = word;
        //msg.lang = this.DEST_LANG;
        msg.addEventListener('end', function() {
            clearTimeout(timeout);
            if (speaking) finish(word);
        });
        //msg.onend = function(e) {

        //}
        msg.onerror = function(e) {
            console.log("error", e);
        }
        msg.onpause = function(e) {
            console.log("pause", e);
        }
        msg.onmark = function(e) {
            console.log("mark", e);
        }
        msg.onboundry = function(e) {
            console.log("boundry", e);
        }

        console.log("saying: " + word);

        var message = speechSynthesis.speak(msg);

        timeout = setTimeout(function() {
            if (speaking) finish(word);
        }, 2000);
    }

    function finish(word) {
        speaking = false;
        tryAnother();
    }

    var workingSentence = "";
    var completeSentence = "";
    var speaking = false;

    function tryAnother() {

        var newPart = workingSentence.substr(completeSentence.length);
        console.log("New Part: \"" + newPart + "\"");
        var words = newPart.split(/[\n ]/);
        console.log(words);
        if (words.length > 1) { //Have at least one complete word with space

            var nextWords = "";
            for (var i = 0; i < words.length - 1; i++) {
                if (words[i] != "")
                    nextWords += words[i] + " ";
            }

            speakWord(nextWords.trim());
            completeSentence += nextWords.trim() + " ";

            //console.log("C: " + completeSentence);
            //console.log("W: " + workingSentence);
        }
    }

    window.update = function() {
        workingSentence = document.getElementById("textBox").value;

        if (!speaking) {
            tryAnother();
        }
    }

    window.onkeyup = function(event) {
        var key = event.keyCode || event.charCode;

        if (key == 8) {
            if (completeSentence.length >= workingSentence.length) {
                var words = completeSentence.split(" ");
                completeSentence = "";
                for (var i = 0; i < words.length; i++) {
                    var word = words[i];
                    if (word.length + 1 + completeSentence.length >= workingSentence.length)
                        break;
                    completeSentence += words[i] + " ";
                }

                console.log(completeSentence);
            }
            tryAnother();
        }
    };
});
