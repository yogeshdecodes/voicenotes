import React, { useState, useEffect } from 'react';
import './App.css';
import micicon from './micicon.svg';
import bars from './bars.svg';

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const mic = new SpeechRecognition();

mic.continuous = true;
mic.interimResults = true;
mic.lang = 'en-US';

function App() {
  const [isListening, setIsListening] = useState(false);
  const [note, setNote] = useState(null);

  useEffect(() => {
    handleListen();
    // eslint-disable-next-line
  }, [isListening]);

  const handleListen = () => {
    if (isListening) {
      mic.start();
      mic.onend = () => {
        console.log('continue..');
        mic.start();
      };
    } else {
      mic.stop();
      mic.onend = () => {
        console.log('Stopped Mic on Click');
      };
    }
    mic.onstart = () => {
      console.log('Mics on');
    };

    mic.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0])
        .map((result) => result.transcript)
        .join('');
      console.log(transcript);
      setNote(transcript);
      mic.onerror = (event) => {
        console.log(event.error);
      };
    };
  };

  const handleSaveNote = () => {
    if (isListening === true) setIsListening((prevState) => !prevState);

    var obj = document.getElementById('textarea1');
    obj.value += ' ' + note;
    setNote('');
  };

  const download = () => {
    var l = document.createElement('a');
    l.href =
      'data:text/plain;charset=UTF-8,' +
      document.getElementById('textarea1').value;
    l.setAttribute('download', 'voicenotes.txt');
    l.click();
  };

  const copy = () => {
    document.getElementById('textarea1').select();
    document.execCommand('copy');
    var message = document.getElementById('message');
    message.innerText = ' copied.';
    setTimeout(() => {
      message.innerText = '';
    }, 1000);
  };

  const clear = () => {
    document.getElementById('textarea1').value = '';
    var message = document.getElementById('message');
    message.innerText = ' cleared.';
    setTimeout(() => {
      message.innerText = '';
    }, 1000);
  };

  window.onload = function () {
    document.addEventListener('keyup', function (event) {
      if (event.which === 13) {
        document.getElementById('save').click();
      }
    });
  };

  return (
    <>
      <nav class="navbar ">
        <h1>
          <img src="./favicon.png" className="icon" alt="logo" />
          VoiceNotes
        </h1>
      </nav>

      <div className="container" id="container">
        <div className="container">
          <h2>Buffer</h2>
          <div className="note-input-top">
            <button
              class="btn"
              onClick={() => setIsListening((prevState) => !prevState)}
            >
              Start/Stop
            </button>
            <button id="save" onClick={handleSaveNote} disabled={!note}>
              Save Note
            </button>
            {isListening ? (
              <img src={bars} className="bars" alt="logo" />
            ) : (
              <img src={micicon} className="bars" alt="logo" />
            )}
          </div>
          <p>
            Tip: While dictating, press "Save Note" to quickly move results from
            buffer to text editor.
          </p>
          {isListening ? <p>Listening...</p> : <p></p>}
          <p>{note}</p>
        </div>
        <div className="note-input-bot">
          <h2>Notes</h2>
          <div class="btns">
            <div>
              <button onClick={copy} id="copy" class="btn">
                Copy
              </button>
              <button onClick={clear} id="clear" class="btn">
                Clear
              </button>
            </div>
            <p id="message"></p>
            <button onClick={download} id="dload" class="btn">
              Download
            </button>
          </div>
          <textarea
            class="input-text"
            rows="3"
            placeholder="// Write a note here"
            id="textarea1"
          ></textarea>
        </div>

        <footer class="bottom">
          Made with ❤️ By{' '}
          <a
            href="https://twitter.com/yogesh_io"
            target="_blank"
            rel="noreferrer"
          >
            Yogesh Yadav
          </a>
        </footer>
      </div>
    </>
  );
}

export default App;
