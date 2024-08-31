// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getDatabase, ref, push, set, onChildAdded } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-database.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "",
    authDomain: "",
    databaseURL: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: ""
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

document.addEventListener('DOMContentLoaded', function() {
    const moodLabel = {
        good: 'いい',
        soso: 'まあまあ',
        bad: 'わるい'
    };
    const moodSelection = document.getElementById('mood-selection');
    const commentDisplay = document.getElementById('comment-display');
    const noteScreen = document.getElementById('note-screen');
    const calendarScreen = document.getElementById('calendar-screen');
    const dayDetails = document.getElementById('day-details');
    const moodText = document.getElementById('mood-text');
    const moodImage = document.getElementById('mood-image');
    const topScreen = document.getElementById('top-screen');
    const startButton = document.getElementById('start-button');
    const momoDai = document.getElementById('momo-dai');
    const heartContainer = document.getElementById('heart-container');
    const calendarBtn = document.getElementById('calendar-btn');
    const chatBtn = document.getElementById('chat-btn');

    let currentMood = null;

    moodSelection.style.display = 'none';
    commentDisplay.style.display = 'none';
    noteScreen.style.display = 'none';
    calendarScreen.style.display = 'none';
    dayDetails.style.display = 'none';
    calendarBtn.style.display = 'none';
    chatBtn.style.display = 'none';

    startButton.addEventListener('click', function() {
        topScreen.style.display = 'none';
        moodSelection.style.display = 'block';
        calendarBtn.style.display = 'block';
        chatBtn.style.display = 'block';
    });

    momoDai.addEventListener('click', function() {
        createHeart();
    });

    function createHeart() {
        const heart = document.createElement('img');
        heart.src = './img/heart.png';
        heart.classList.add('heart-icon');

        // #momo-dai-animation 内でランダムな位置にハートを表示
        const xPos = Math.random() * 80 + 10; // 左右方向の位置
        const yPos = Math.random() * 80 + 10; // 上下方向の位置

        heart.style.left = `${xPos}%`;
        heart.style.top = `${yPos}%`;

        heartContainer.appendChild(heart);

    
    }

    
  

    document.querySelectorAll('.mood-icon').forEach(icon => {
        icon.addEventListener('click', function() {
            currentMood = this.dataset.mood;
            const randomIndex = Math.floor(Math.random() * moodData[currentMood].comments.length);
            moodText.textContent = moodData[currentMood].comments[randomIndex];
            moodImage.src = moodData[currentMood].image;
            moodSelection.style.display = 'none';
            chatBtn.style.display = 'none';
            commentDisplay.style.display = 'block';
        });
    });

    const moodData = {
        good: {
            comments: ["きょうも1にちがんばったね", "えがおがすてき", "このちょうしだよ"],
            image: "./img/good2.png"
        },
        soso: {
            comments: ["きょうはなにがおこるかな", "きらくにいこう", "いつもどおりでいいよ"],
            image: "./img/soso2.png"
        },
        bad: {
            comments: ["きょうはゆっくりやすもうね", "だいじょうぶ、いっぽずつ", "いきてるだけですごいんだよ"],
            image: "./img/bad2.png"
        }
    };

    document.getElementById('write-note').addEventListener('click', function() {
        commentDisplay.style.display = 'none';
        noteScreen.style.display = 'block';
    });

    document.getElementById('save-note').addEventListener('click', function() {
        const noteInput = document.getElementById('note-input');
        const now = new Date();
        const localDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const dateStr = localDate.toISOString().split('T')[0];
        localStorage.setItem(dateStr, JSON.stringify({
            note: noteInput.value,
            mood: moodText.textContent,
            moodLabel: currentMood
        }));
        noteInput.value = '';
        noteScreen.style.display = 'none';
        moodSelection.style.display = 'block';
    });

    document.getElementById('calendar-btn').addEventListener('click', function() {
        moodSelection.style.display = 'none';
        commentDisplay.style.display = 'none';
        noteScreen.style.display = 'none';
        dayDetails.style.display = 'none';
        calendarBtn.style.display = 'none';
        chatBtn.style.display = 'none';
        displayCalendar();
        calendarScreen.style.display = 'block';
    });

    function displayCalendar() {
        const calendar = document.getElementById('calendar');
        calendar.innerHTML = '';
        const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
        const monthEnd = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);

        for (let day = monthStart; day <= monthEnd; day.setDate(day.getDate() + 1)) {
            const dateStr = day.toISOString().split('T')[0];
            const dayData = JSON.parse(localStorage.getItem(dateStr));
            const dayElem = document.createElement('div');
            dayElem.textContent = day.getDate() + (dayData ? `: ${moodLabel[dayData.moodLabel]}` : ": きろくはないよ");
            dayElem.addEventListener('click', () => {
                displayDayDetails(dateStr);
            });
            calendar.appendChild(dayElem);
        }
    }

    function displayDayDetails(dateStr) {
        const data = JSON.parse(localStorage.getItem(dateStr));
        document.getElementById('selected-day-mood').textContent = data ? `Mood: ${moodLabel[data.moodLabel]}` : "きぶんのきろくはないよ";
        document.getElementById('selected-day-note').textContent = data ? `Note: ${data.note}` : "メモのきろくはないよ";
        commentDisplay.style.display = 'none';
        noteScreen.style.display = 'none';
        dayDetails.style.display = 'none';
        calendarScreen.style.display = 'none';
        dayDetails.style.display = 'block';
    }

    // 背景変更機能の追加
    document.querySelectorAll('.background-option').forEach(option => {
        option.addEventListener('click', function() {
            const selectedBg = this.dataset.bg;
            document.body.style.backgroundImage = `url('./img/${selectedBg}')`;
        });
    });

    // チャット機能
    document.getElementById('chat-btn').addEventListener('click', function() {
        const chatContainer = document.getElementById('chat-container');
        chatContainer.innerHTML = `
            <input type="text" id="name-input" placeholder="名前">
            <input type="text" id="message-input" placeholder="メッセージ">
            <button onclick="sendMessage()">そうしん</button>
            <ul id="messages-list"></ul>
        `;
        chatContainer.style.display = 'block';
        moodSelection.style.display = 'none';
        calendarBtn.style.display = 'none';
        chatBtn.style.display = 'none';
    });

    window.sendMessage = function() {
        const nameInput = document.getElementById('name-input');
        const messageInput = document.getElementById('message-input');
        const now = new Date();
        const timestamp = `${now.getFullYear()}/${now.getMonth() + 1}/${now.getDate()} ${now.getHours()}:${now.getMinutes()}`;

        if (nameInput.value && messageInput.value) {
            const messagesRef = ref(database, 'messages');
            const newMessageRef = push(messagesRef);

            set(newMessageRef, {
                name: nameInput.value,
                text: messageInput.value,
                timestamp: timestamp
            });

            messageInput.value = '';
        }
    };

    const messagesRef = ref(database, 'messages');

    onChildAdded(messagesRef, (snapshot) => {
        const message = snapshot.val();
        const li = document.createElement('li');
        li.textContent = `${message.name}: ${message.text} (${message.timestamp})`;
        document.getElementById('messages-list').appendChild(li);
    });
});
