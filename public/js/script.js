      
(function ($) {
    "use strict";
      $('.sakura-falling').sakura();
})(jQuery);

$(document).on('click', function(){
    document.getElementById("my_audio").play();
    console.log('Shaadi me zaroor aana');
});

// Set the date we're counting down to
var countDownDate = new Date("Feb 12, 2024 00:00:00").getTime();

// Update the count down every 1 second
var x = setInterval(function() {

    // Get todays date and time
    var now = new Date().getTime();
    
    // Find the distance between now and the count down date
    var distance = countDownDate - now;
    
    // Time calculations for days, hours, minutes and seconds
    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
    // Output the result in an element with id="demo"
    document.getElementById("time").innerHTML = "<div class='container'><div class='days block'>"+ days + "<br>Days</div>" + "<div class='hours block'>" + hours + "<br>Hours</div>" + "<div class='minutes block'>" + minutes + "<br>Minutes</div>" + "<div class='seconds block'>" + seconds + "<br>Seconds</div></div>";
    
    // If the count down is over, write some text 
    if (distance < 0) {
        clearInterval(x);
        document.getElementById("time").innerHTML = "Bless the married couple for happy life!";
    }
}, 1000);

// being a bit cool :p  
var styles = [
    'background: linear-gradient(#D33106, #571402)'
    , 'border: 4px solid #3E0E02'
    , 'color: white'
    , 'display: block'
    , 'text-shadow: 0 2px 0 rgba(0, 0, 0, 0.3)'
    , 'box-shadow: 0 2px 0 rgba(255, 255, 255, 0.4) inset, 0 5px 3px -5px rgba(0, 0, 0, 0.5), 0 -13px 5px -10px rgba(255, 255, 255, 0.4) inset'
    , 'line-height: 10px'
    , 'text-align: center'
    , 'font-weight: bold'
    , 'font-size: 32px'
].join(';');

var styles1 = [
    'color: #FF6C37'
    , 'display: block'
    , 'text-shadow: 0 2px 0 rgba(0, 0, 0, 1)'
    , 'line-height: 10px'
    , 'font-weight: bold'
    , 'font-size: 32px'
].join(';');

var styles2 = [
    'color: teal'
    , 'display: block'
    , 'text-shadow: 0 2px 0 rgba(0, 0, 0, 1)'
    , 'line-height: 10px'
    , 'font-weight: bold'
    , 'font-size: 32px'
].join(';');

console.log('\n\n%c SAVE THE DATE: 12th Feb, 2024!', styles);

console.log('%cYour presence is requested!%c\n\nRegards: Kush Patel', styles1, styles2);

console.log(
    `%cShaadi me zaroor aana!\n\n`,
    'color: yellow; background:tomato; font-size: 24pt; font-weight: bold',
)

//Header logic
let navToggle = document.querySelector(".nav__toggle");
let navWrapper = document.querySelector(".nav__wrapper");

navToggle.addEventListener("click", function () {
  if (navWrapper.classList.contains("active")) {
    this.setAttribute("aria-expanded", "false");
    this.setAttribute("aria-label", "menu");
    navWrapper.classList.remove("active");
  } else {
    navWrapper.classList.add("active");
    this.setAttribute("aria-label", "close menu");
    this.setAttribute("aria-expanded", "true");
  }
});


//LOGIC
var fileInput = document.getElementById('fileInput');
        var fileInputLabel = document.getElementById('fileInputLabel');

        fileInput.addEventListener('change', function () {
            if (fileInput.files && fileInput.files.length > 0) {
                var fileName = '';
                if (fileInput.files.length === 1) {
                    fileName = fileInput.files[0].name;
                } else {
                    fileName = fileInput.files.length + ' files selected';
                }
                fileInputLabel.textContent = fileName;
            } else {
                fileInputLabel.textContent = 'Select Files';
            }
        });

        const fileUploadForm = document.getElementById('fileUploadForm');
        fileUploadForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await fetch('/upload', {
                method: 'POST',
                body: new FormData(fileUploadForm),
            }).then(response => {
                document.querySelector('p').textContent = "Successfully uploaded files to drive";
                fileInputLabel.textContent = "Select Files";
                document.querySelector('p').style.display = 'block';
                console.log(response);
            }).catch(error => {
                document.querySelector('p').textContent = "Files were not uploaded: " + error;
                document.querySelector('p').style.display = 'block';
                console.error(error);
            });
        });

        const emailForm = document.getElementById('emailForm');
        emailForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            await fetch('/submitEmail', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            }).then(response => {
                document.querySelector('p').textContent = "Email submitted successfully";
                document.querySelector('p').style.display = 'block';
                console.log(response);
            }).catch(error => {
                document.querySelector('p').textContent = "Email was not submitted: " + error;
                document.querySelector('p').style.display = 'block';
                console.error(error);
            });
        });

	
        var typedDescription = new Typed('#typed-description', {
            
            strings: ['Dear Guest,We hope this message finds you well and filled with the same joy and love that surrounded us on our wedding day. As we take a moment to reflect on the beautiful memories created, we are overwhelmed with gratitude for having you there with us.\nWith love and gratitude,\n"Meghal and Khyati"'],
            typeSpeed: 20,
        });


    var typed2 = new Typed("#typed-h2", {
      strings: ["Rent this website"],
      typeSpeed: 45,
    });
    var typed3 = new Typed("#typed-p", {
      strings: ["Contact us for details and pricing: "],
      typeSpeed: 20,
    });
  