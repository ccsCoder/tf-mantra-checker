document.addEventListener("DOMContentLoaded", () => {
  const button = document.getElementById("start-chanting");
  button.addEventListener("click", () => {
    button.classList.add("invisible");

    // show hide animation
    const imgClassList = document.querySelector(".listening").classList;
    imgClassList.remove("invisible");
    imgClassList.add("visible");

    // Start listening
    startListening();
  });
});

const startListening = () => {
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        const recognition = new (window.SpeechRecognition ||
          window.webkitSpeechRecognition)();

        recognition.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          console.log("You said  = ", transcript);
          checkPronounciation(transcript);
        };

        recognition.onend = () => {
          recognition.start(); // Restart recognition after it ends
        };

        recognition.start();
      })
      .catch((err) => {
        console.error("Error accessing microphone:", err);
      });
  } else {
    console.error("getUserMedia not supported on your browser!");
  }
};

const checkPronounciation = async (transcript) => {
  console.log("checking pronounciation...");
  const confidence = await testPhrase(transcript);
  console.log("confidence = ", confidence);
  let result = "";

  if (confidence > 50) {
    result = "success";
  } else {
    result = "failure";
  }

  const mantra = document.getElementById("mantra");
  mantra.className = "";
  mantra.classList.add(result);
};
