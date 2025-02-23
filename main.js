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
    const formattedTranscript = formatTranscript();
    saveTranscript(formattedTranscript, analysis);

    console.log('Conversation Summary:\n', generateSummary(analysis));
    console.log('Full Transcript:\n', formattedTranscript);

  } catch (error) {
    console.error('Disconnection Error:', error);
    alert('Failed to end call properly');
  } finally {
    resetInterface();
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

function saveTranscript(formatted, analysis) {
  try {
    // Local Storage
    localStorage.setItem('conversation-raw', JSON.stringify(transcript));
    localStorage.setItem('conversation-formatted', formatted);
    localStorage.setItem('conversation-analysis', JSON.stringify(analysis));

    // Server Submission (uncomment to enable)
    // fetch('/api/conversations', {
    //     method: 'POST',
    //     headers: {'Content-Type': 'application/json'},
    //     body: JSON.stringify({ transcript, formatted, analysis })
    // });

  } catch (error) {
    console.error('Saving failed:', error);
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