
    alert('hi');

  //  var p = $('p');

    //p.html(function (index, oldHtml) {
    //    return oldHtml.replace(/\b(\w+?)\b/g, '<span class="word">$1</span>')
    //    });

  

    //p.click(function (event) { alert(event.target.innerHTML) });



    //p.mouseover(function (event) { alert(event.target.innerText) });

    var video1 = document.getElementsByTagName("video");
    var trackCur = video1[0].textTracks[0];
    console.log(trackCur);

    trackCur.oncuechange = function () {
        var cue = this.activeCues[0];
        if (cue !== undefined) {
      //      cue.text = "<p>" + cue.text + "</p>";
            console.log(cue.text);
            var dsp = document.getElementById("subt"); // get display area 

            
            dsp.innerHTML = "Text: " + cue.text.replace(/\b(\w+?)\b/g, '<span class="word" onmouseover=Change(this)>$1</span>');
            cue = undefined;// show text
            //     dsp.innerHTML += "<br />StartTime: " + cue.startTime; // show start time 
            //    dsp.innerHTML += "<br />End Time: " + cue.endTime;
        }
    }

function Change(x) {
    console.log(x.innerHTML);
}

    //video1[0].click = function () {
    //    alert("нажали на видео");
    //}

   ///video1[0].onmouseover = function () {
   // //    video1[0].play();
   // //    // alert("нажали на видео");
   // //}

   //     function ChangeOver(x) {
            //    //    alert("навели");
            //    //  alert(cueCur[i].text);
            //    video1[0].play()
            //}




