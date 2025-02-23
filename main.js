// // Enter your token server url to connect to your project
// // NOTE: your token server must allow requests from 'https://web-platform-9chn6x.stackblitz.io'
// //const tokenServer = 'http://localhost:5001/auth/authorize';

// // Note that your API key must allow requests from
// // this StackBlitz demo: 'https://web-platform-9chn6x.stackblitz.io'
// // Note that the URL will change if you fork this project
// import { Persona, Scene } from '@soulmachines/smwebsdk'
// import screenfull from 'screenfull';

// const element = document.getElementById('target');

// document.getElementById('fullscreen-button').addEventListener('click', () => {
// 	if (screenfull.isEnabled) {
// 		screenfull.toggle(element, {navigationUI: 'hide'});
// 	}
// });

// let scene;

// let persona = null;
// const PERSONA_ID = '1';

// /**
//  * Start a new connection.
//  * Request a JWT from the token server and use it
//  * to connect to the Soul Machines session server.
//  */
// async function connect() {
//   // get the video element
//   const videoEl = document.getElementById('sm-video');

//   // create a new scene object
//   scene = new Scene({
//     apiKey: import.meta.env.VITE_SM_API_KEY,
//     videoElement: videoEl,
//     requestedMediaDevices: { microphone: true, camera: true },
//     requiredMediaDevices: { microphone: true, camera: true },
//   });

//   // connect the Scene to the session server
//   await scene
//     .connect()
//     .then((sessionId) => onConnectionSuccess(sessionId))
//     .catch((error) => onConnectionError(error));
// }

// /**
//  * Handle successful connection
//  * On success, we must start the video.
//  */
// function onConnectionSuccess(sessionId) {
//   console.info('success! session id:', sessionId);

//   // start the video playing
//   scene
//     .startVideo()
//     .then((videoState) => console.info('started video with state:', videoState))
//     .catch((error) => console.warn('could not start video:', error));
// }

// /**
//  * Handle failed connection
//  * On error, we must display some feedback to the user
//  */
// function onConnectionError(error) {
//   switch (error.name) {
//     case 'noUserMedia':
//       console.warn('user blocked device access');
//       break;
//     case 'noScene':
//     case 'serverConnectionFailed':
//       console.warn('server connection failed');
//       break;
//     default:
//       console.warn('unhandled error:', error);
//   }
// }

// /**
//  * Event listeners for button in the HTML
//  */
// const connectButton = document.getElementById('connect-button');
// connectButton.addEventListener('click', () => {
//     const video = document.getElementById('sm-video');
//     connect();
//     connectButton.style.display = "none";
//     video.style.height = "100%";
//     video.style.width = "100%";
//   }
// );

// function stopSpeaking() {
//   console.log('stopSpeaking');
//   if (!persona) {
//     persona = new Persona(scene, PERSONA_ID);
//   }
//   persona.stopSpeaking();
// }

// function toggleUserMicrophone() {
//   console.log('toggleUserMicrophone');
//   const active = scene.isMicrophoneActive();
//   scene.setMediaDeviceActive({ microphone: !active })
//   .then(() => console.log('microphone active: ' + active))
//   .catch((error) => console.log('microphone update failed: ', error));
// }

// // function handleKeyPress(event) {
// //   const key = event.key || String.fromCharCode(event.keyCode);
// //   console.log('Key Code:', event.keyCode);
// //   console.log('Key Value:', key);
// //   if (key === 'Enter') {
// //     stopSpeaking();
// //   } else if (key === ' ') {
// //     toggleUserMicrophone();
// //   }
// // }

// // document.addEventListener('keydown', handleKeyPress);

// document.addEventListener('DOMContentLoaded', function() {
//   const video = document.getElementById('sm-video');
//   // video.addEventListener('contextmenu', function(event) {
//   //   event.preventDefault(); // Prevent default context menu behavior
//   //   toggleUserMicrophone();
//   // });
//   video.addEventListener('click', function(event) {
//     console.log('Button Code:', event.button);
//     if (event.button === 0) { // Left mouse button clicked
//       stopSpeaking();
//       toggleUserMicrophone();
//     }
//   });
// });
import { Persona, Scene } from '@soulmachines/smwebsdk';
import screenfull from 'screenfull';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, setDoc } from "firebase/firestore";
// import fetch from 'node-fetch';

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyDUEbNely3njV2q3waufu6vyp9AsPGj3VA",
  authDomain: "hackx-7b82c.firebaseapp.com",
  projectId: "hackx-7b82c",
  storageBucket: "hackx-7b82c.appspot.com",
  messagingSenderId: "256301486788",
  appId: "1:256301486788:web:fcc661a891b815910fef91",
  measurementId: "G-X82DBR2K5K"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const API = "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";

// DOM Elements
const element = document.getElementById('target');
const connectButton = document.getElementById('connect-button');
const endCallButton = document.getElementById('end-call-button');
const videoElement = document.getElementById('sm-video');

// Core Variables
let scene = null;
let persona = null;
const PERSONA_ID = '1';
let transcript = [];
let conversationStartTime = null;

// Initialize button states
connectButton.setAttribute('aria-disabled', 'false');
endCallButton.setAttribute('aria-disabled', 'true');

// Fullscreen Handler
document.getElementById('fullscreen-button').addEventListener('click', () => {
  screenfull.isEnabled && screenfull.toggle(element, { navigationUI: 'hide' });
});

// Connection Handler
async function connect() {
  try {
    conversationStartTime = new Date();
    // In your Scene configuration, add CORS headers
    scene = new Scene({
      apiKey: "eyJzb3VsSWQiOiJkZG5hLXJvaGl0LWphbWJodWxrYXItb3JnLS1tdWx0aWxhbmd1YWdlIiwiYXV0aFNlcnZlciI6Imh0dHBzOi8vZGguc291bG1hY2hpbmVzLmNsb3VkL2FwaS9qd3QiLCJhdXRoVG9rZW4iOiJhcGlrZXlfdjFfZGYwMGExY2MtZjVmNy00MTFhLWJlM2ItZGQ0ZTJkZDQ5MTdmIn0=",
      videoElement: videoElement,
      requestedMediaDevices: { microphone: true, camera: true },
      requiredMediaDevices: { microphone: true, camera: true },
      connectionOptions: {
        headers: {
          'Access-Control-Allow-Origin': 'https://soul-machines-avatar.vercel.app',
          'Vary': 'Origin'
        }
      }
    });

    await scene.connect();
    persona = new Persona(scene, PERSONA_ID);
    await persona.conversationSend('', {}, { kind: "init" });
    await scene.startVideo();

    // UI Updates
    videoElement.muted = false;
    connectButton.setAttribute('aria-disabled', 'true');
    endCallButton.setAttribute('aria-disabled', 'false');
    videoElement.style.height = "100%";
    videoElement.style.width = "100%";

    setupConversationListeners();

  } catch (error) {
    console.error('Connection Error:', error);
    alert(`Connection failed: ${error.message || 'Unknown error'}`);
    resetInterface();
  }
}

// Disconnection Handler
async function endCall() {
  if (!scene?.isConnected()) return;

  try {
    await scene.disconnect();
    cleanupMediaStreams();

    const analysis = analyzeConversation();



    const rawTranscript = formatTranscript(); //grok fetcheing
    const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";  // ✅ Correct URL


    async function enhanceTranscript(transcript) {
      try {
        const response = await fetch(GROQ_API_URL, {  // Use the correct URL
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API}`
          },
          body: JSON.stringify({
            model: "mixtral-8x7b-32768",
            messages: [
              { role: "system", content: "You are a virtual health assistant trained to conduct preliminary health assessments based on user input. give detailed descriptions to explain the user's symptoms, medical history, and lifestyle. Provide an analysis of possible health concerns while clearly stating that this is not a medical diagnosis. Suggest whether the user should seek medical attention and recommend general wellness advice based on their symptoms. Keep your responses clear, concise, and reassuring. " },
              { role: "user", content: `Enhance the following transcript: and also remove the timestamp, it looks unprofessional \n\n${transcript}` }
            ]
          })
        });

        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

        const data = await response.json();
        return data?.choices?.[0]?.message?.content?.trim() || transcript;

      } catch (error) {
        console.error("Groq API Error:", error);
        return transcript; // Return original transcript if enhancement fails
      }
    }

  //   async function enhanceTranscript(formattedTranscript) {
  //     try {
  //         const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
  //             method: "POST",
  //             headers: {
  //                 "Authorization": `Bearer ${API_KEY}`,  // ✅ Ensure the API key is correct
  //                 "Content-Type": "application/json"
  //             },
  //             body: JSON.stringify({
  //                 model: "llama3-8b-8192",
  //                 messages: [{ role: "user", content: `Enhance this transcript: ${formattedTranscript}` }]
  //             })
  //         });
  
  //         if (!response.ok) {
  //             throw new Error(`HTTP Error: ${response.status}`);
  //         }
  
  //         const data = await response.json();
  //         return data.choices[0].message.content;  // ✅ Extract the enhanced text
  
  //     } catch (error) {
  //         console.error("Groq API Error:", error);
  //         return formattedTranscript;  // Return original if API fails
  //     }
  // }

    const formattedTranscript = await enhanceTranscript(rawTranscript);

    // Save transcript to Firebase Firestore
    await saveTranscriptToFirestore(formattedTranscript, analysis);

    console.log('Conversation Summary:\n', generateSummary(analysis));
    console.log('Full Transcript:\n', formattedTranscript);

  } catch (error) {
    console.error('Disconnection Error:', error);
    alert('Failed to end call properly');
  } finally {
    resetInterface();
  }
}

// Save Transcript to Firebase Firestore
async function saveTranscriptToFirestore(formattedTranscript, analysis) {
  try {
    const userEmail = "chetandagajipatil333@gmail.com"; // Replace with dynamic user email if needed
    // const reportsCollection = collection(db, "users", userEmail, "reports");
    // const reportDoc = doc(reportsCollection);

    // await setDoc(reportDoc, {
    //   name: formattedTranscript,
    //   id: reportsCollection
    // });

    const reportsCollection = collection(db, "users", userEmail, "reports");
    const reportDoc = doc(reportsCollection); // Generates a unique document ID

    await setDoc(reportDoc, {
      name: formattedTranscript,   // ✅ Store transcript text
      id: reportDoc.id             // ✅ Store document ID as a string
    });
    console.log("Transcript successfully saved to Firestore");
  } catch (error) {
    console.error("Error saving transcript to Firestore:", error);
  }
}

// Conversation Tracking
function setupConversationListeners() {
  // AI Speech Tracking
  scene.onStateEvent.addListener((_, event) => {
    const state = event.persona?.[PERSONA_ID];
    if (state?.speechState === 'speaking') {
      addTranscriptEntry({
        source: 'AI',
        text: state.currentSpeech,
        type: 'speech',
        timestamp: new Date()
      });
    }
  });

  // User Speech Tracking
  scene.onRecognizeResultsEvent.addListener((_, status, __, results) => {
    if (status === 'success' && results[0]?.final) {
      addTranscriptEntry({
        source: 'User',
        text: results[0].alternatives[0].transcript,
        type: 'speech',
        confidence: results[0].alternatives[0].confidence,
        timestamp: new Date()
      });
    }
  });

  // Text Input Tracking
  document.getElementById('text-message-input')?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      const input = e.target;
      const text = input.value.trim();
      if (text) {
        addTranscriptEntry({
          source: 'User',
          text: text,
          type: 'text',
          timestamp: new Date()
        });
        persona.conversationSend(text, {}, {});
        input.value = '';
      }
    }
  });
}

// Transcript Management
function addTranscriptEntry(entry) {
  transcript.push({
    ...entry,
    timestamp: entry.timestamp.toISOString()
  });
}

function formatTranscript() {
  return transcript.map((entry, index) => {
    const time = new Date(entry.timestamp).toLocaleTimeString();
    return `[${time}] ${entry.source}: ${entry.text}${entry.type === 'speech' ? ' (Voice)' : ' (Text)'}`;
  }).join('\n');
}

// Analysis Functions
function analyzeConversation() {
  const userEntries = transcript.filter(entry => entry.source === 'User');
  const aiEntries = transcript.filter(entry => entry.source === 'AI');

  return {
    duration: new Date() - conversationStartTime,
    totalExchanges: transcript.length,
    user: {
      textInputs: userEntries.filter(e => e.type === 'text').length,
      voiceInputs: userEntries.filter(e => e.type === 'speech').length,
      averageConfidence: calculateAverageConfidence(userEntries)
    },
    ai: {
      averageResponseTime: calculateAverageResponseTime(),
      responses: aiEntries.length
    },
    topics: detectTopics()
  };
}

function calculateAverageResponseTime() {
  let responseTimes = [];
  let lastUserTime;

  transcript.forEach(entry => {
    if (entry.source === 'User') {
      lastUserTime = new Date(entry.timestamp);
    }
    if (entry.source === 'AI' && lastUserTime) {
      responseTimes.push(new Date(entry.timestamp) - lastUserTime);
      lastUserTime = null;
    }
  });

  return responseTimes.length > 0
    ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length
    : 0;
}

function detectTopics() {
  const keywordMap = {
    account: ['login', 'password', 'sign in', 'account'],
    payments: ['payment', 'invoice', 'billing', 'charge'],
    technical: ['error', 'bug', 'issue', 'problem']
  };

  return Object.entries(keywordMap).reduce((acc, [category, keywords]) => {
    const matches = transcript.filter(entry =>
      keywords.some(keyword =>
        entry.text.toLowerCase().includes(keyword)
      )
    );
    if (matches.length > 0) acc[category] = matches.length;
    return acc;
  }, {});
}

function calculateAverageConfidence(entries) {
  const confidences = entries
    .filter(e => typeof e.confidence === 'number')
    .map(e => e.confidence);
  return confidences.length > 0
    ? confidences.reduce((a, b) => a + b, 0) / confidences.length
    : null;
}

// Utility Functions
function generateSummary(analysis) {
  return `
    Conversation Summary:
    Duration: ${Math.round(analysis.duration / 1000 / 60)} minutes
    Total Exchanges: ${analysis.totalExchanges}
    User Inputs: ${analysis.user.voiceInputs} voice, ${analysis.user.textInputs} text
    AI Response Time: ${Math.round(analysis.ai.averageResponseTime / 1000)}s average
    Key Topics: ${Object.keys(analysis.topics).join(', ') || 'None detected'}
    `;
}

function cleanupMediaStreams() {
  if (videoElement.srcObject) {
    videoElement.srcObject.getTracks().forEach(track => track.stop());
    videoElement.srcObject = null;
  }
}

function resetInterface() {
  connectButton.setAttribute('aria-disabled', 'false');
  endCallButton.setAttribute('aria-disabled', 'true');
  videoElement.style.backgroundColor = '#f8f9fa';
  transcript = [];
  conversationStartTime = null;
}

// Event Listeners
connectButton.addEventListener('click', connect);
endCallButton.addEventListener('click', endCall);