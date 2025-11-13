// 게임 상태 관리
const gameState = {
    currentStage: 1,
    correctCount: 0,
    wrongCount: 0,
    unlockedStages: [1], // 기본적으로 1days만 열림
    minCorrectToUnlock: 15 // 다음 스테이지 해제를 위한 최소 정답 수
};

// 스토리 데이터 (화자 정보 포함)
const stories = {
    1: [
        { speaker: "senior", text: "무안군 인간 쉘터의 검문소에서 일하게 된 걸 축하해." },
        { speaker: "senior", text: "어떤 일을 하는지는 알고 있나?" },
        { speaker: "player", text: "네, 인간과 안드로이드를 구분해서 인간만을 통과시켜야 합니다!" },
        { speaker: "senior", text: "그래, 맞아. 인간만을 대피소에 들이고, 인간인 척 하는 인공지능 로봇들은 전부 내쫓는 것." },
        { speaker: "senior", text: "그들을 구분하는 기준은 딱 하나야." },
        { speaker: "senior", text: "외관상의 차이." },
        { speaker: "senior", text: "인공지능 로봇은 대부분 기계 부품이 겉으로 드러나 있어." },
        { speaker: "senior", text: "벗겨진 피부 사이로 회색의 차가운 몸체가 보인다든가, 팔이 철골로 이루어져 있다든가..." },
        { speaker: "senior", text: "인간인 것 같다면 초록색 버튼을 눌러 문을 열어줘." },
        { speaker: "senior", text: "안드로이드라고 판단된다면, 빨간색 버튼을 눌러." },
        { speaker: "senior", text: "그러니 안드로이드를 우리 쉘터에 들이지 않도록 주의 깊게 관찰하도록 해." },
        { speaker: "senior", text: "행운을 빌어." }
    ],
    2: [
        { speaker: "senior", text: "두 번째 날이 시작되었습니다." },
        { speaker: "senior", text: "오늘도 수많은 사람들이 통과하려 합니다." },
        { speaker: "senior", text: "어제보다 더 교묘한 위장이 있을 수 있습니다." },
        { speaker: "senior", text: "주의하세요." }
    ],
    3: [
        { speaker: "senior", text: "세 번째 날입니다." },
        { speaker: "senior", text: "상황이 더 복잡해지고 있습니다." },
        { speaker: "senior", text: "신뢰하되 검증하세요." }
    ],
    4: [
        { speaker: "senior", text: "네 번째 날." },
        { speaker: "senior", text: "당신의 경험은 쌓여가고 있습니다." },
        { speaker: "senior", text: "하지만 적들도 더욱 똑똑해지고 있습니다." }
    ],
    5: [
        { speaker: "senior", text: "마지막 날입니다." },
        { speaker: "senior", text: "모든 것이 오늘 결정됩니다." },
        { speaker: "senior", text: "최선을 다하세요." }
    ]
};

// 캐릭터 정보
const characters = {
    senior: {
        name: "선배",
        portrait: "senior" // 나중에 이미지로 교체 가능
    },
    player: {
        name: "검문관",
        portrait: "player" // 나중에 이미지로 교체 가능
    }
};

// localStorage에서 진행도 로드
function loadProgress() {
    const saved = localStorage.getItem('turingDeskProgress');
    if (saved) {
        const progress = JSON.parse(saved);
        gameState.unlockedStages = progress.unlockedStages || [1];
        // 스테이지 버튼 업데이트
        updateStageButtons();
    }
}

// 진행도 저장
function saveProgress() {
    localStorage.setItem('turingDeskProgress', JSON.stringify({
        unlockedStages: gameState.unlockedStages
    }));
}

// 화면 전환
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

// 스테이지 버튼 업데이트
function updateStageButtons() {
    for (let i = 1; i <= 5; i++) {
        const btn = document.getElementById(`stage-${i}`);
        if (gameState.unlockedStages.includes(i)) {
            btn.classList.remove('locked');
            btn.textContent = `${i} DAYS`;
        } else {
            btn.classList.add('locked');
            btn.textContent = '???';
        }
    }
}

// 스테이지 스토리 표시
let currentStoryIndex = 0;
let currentStory = [];

function showStory(stage) {
    const storyText = document.getElementById('story-text');
    const characterPortrait = document.getElementById('character-portrait');
    const characterName = document.getElementById('character-name');
    const story = stories[stage] || [];
    currentStory = story;
    currentStoryIndex = 0;

    function displayNextLine() {
        if (currentStoryIndex < currentStory.length) {
            const dialogue = currentStory[currentStoryIndex];
            
            // 대사 표시
            if (typeof dialogue === 'string') {
                // 기존 형식 (문자열만 있는 경우)
                storyText.textContent = dialogue;
                characterName.textContent = '';
                characterPortrait.classList.remove('senior', 'player');
            } else {
                // 새로운 형식 (화자 정보 포함)
                storyText.textContent = dialogue.text;
                const character = characters[dialogue.speaker];
                if (character) {
                    characterName.textContent = character.name;
                    characterPortrait.className = 'character-portrait ' + dialogue.speaker;
                }
            }
            
            currentStoryIndex++;
        } else {
            // 스토리 종료, 게임 시작
            startGame(stage);
        }
    }

    // 초기 표시
    displayNextLine();

    // Next 버튼 이벤트 재설정
    const nextBtn = document.getElementById('story-next-btn');
    nextBtn.onclick = displayNextLine;
}

// 랜덤 이름 생성
const firstNames = ['김', '이', '박', '최', '정', '강', '조', '윤', '장', '임', '한', '오', '서', '신', '권', '황', '안', '송', '전', '홍'];
const lastNames = ['민준', '서준', '도윤', '예준', '시우', '주원', '하준', '지호', '건우', '준서', '현우', '지훈', '우진', '선우', '연우', '서연', '서윤', '지우', '서현', '민서', '하은', '윤서', '지유', '채원', '지원'];

function generateRandomName() {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    return `${firstName}${lastName}`;
}

// 랜덤 출신지 생성
const locations = [
    '서울', '부산', '인천', '대구', '대전', '광주', '울산', '수원', '고양', '용인',
    '성남', '부천', '청주', '안산', '전주', '안양', '창원', '천안', '김해', '화성',
    '평양', '함흥', '원산', '신의주', '개성', '해주', '남포', '사리원', '정주', '신천'
];

function generateRandomLocation() {
    return locations[Math.floor(Math.random() * locations.length)];
}

// 랜덤 만료기한 생성 (2100.01.01 ~ 2200.12.31)
function generateRandomExpiry() {
    const startYear = 2100;
    const endYear = 2200;
    const year = Math.floor(Math.random() * (endYear - startYear + 1)) + startYear;
    const month = Math.floor(Math.random() * 12) + 1;
    const day = Math.floor(Math.random() * 28) + 1; // 28일로 제한하여 유효한 날짜 보장
    
    const monthStr = month.toString().padStart(2, '0');
    const dayStr = day.toString().padStart(2, '0');
    
    return `${year}.${monthStr}.${dayStr}`;
}

// 현재 캐릭터 데이터
let currentCharacter = null;

// 새 캐릭터 생성
function generateNewCharacter() {
    currentCharacter = {
        name: generateRandomName(),
        origin: generateRandomLocation(),
        expiry: generateRandomExpiry(),
        isHuman: Math.random() > 0.5 // 50% 확률로 인간/로봇
    };
    
    // 화면 업데이트
    document.getElementById('id-name').textContent = currentCharacter.name;
    document.getElementById('id-origin').textContent = currentCharacter.origin;
    document.getElementById('id-expiry').textContent = currentCharacter.expiry;
    
    // 캐릭터 스프라이트 업데이트 (나중에 이미지로 교체)
    const spritePlaceholder = document.querySelector('.sprite-placeholder');
    spritePlaceholder.textContent = currentCharacter.isHuman ? 'HUMAN' : 'ROBOT';
    
    // ID 사진 플레이스홀더 업데이트
    const photoPlaceholder = document.getElementById('id-photo-placeholder');
    photoPlaceholder.textContent = currentCharacter.isHuman ? 'HUMAN' : 'ROBOT';
    
    // 적외선 탐지 바 리셋
    document.querySelector('.detection-fill').style.width = '0%';
}

// 게임 시작
function startGame(stage) {
    gameState.currentStage = stage;
    gameState.correctCount = 0;
    gameState.wrongCount = 0;
    
    // 게임 화면 업데이트
    document.getElementById('current-day').textContent = stage;
    document.getElementById('score').textContent = '0';
    document.getElementById('correct-count').textContent = '0';
    document.getElementById('wrong-count').textContent = '0';
    
    showScreen('game-screen');
    
    // 첫 캐릭터 생성
    generateNewCharacter();
}

// 게임 종료 및 정산
function endGame(correct, wrong) {
    gameState.correctCount = correct;
    gameState.wrongCount = wrong;
    
    // 정산 화면 업데이트
    document.getElementById('result-correct').textContent = correct;
    document.getElementById('result-wrong').textContent = wrong;
    document.getElementById('result-total').textContent = correct + wrong;
    
    // 다음 스테이지 해제 확인
    const unlockMessage = document.getElementById('unlock-message');
    const currentStage = gameState.currentStage;
    
    if (currentStage < 5 && correct >= gameState.minCorrectToUnlock) {
        const nextStage = currentStage + 1;
        if (!gameState.unlockedStages.includes(nextStage)) {
            gameState.unlockedStages.push(nextStage);
            saveProgress();
            unlockMessage.textContent = `STAGE ${nextStage} UNLOCKED!`;
            unlockMessage.classList.add('show');
        } else {
            unlockMessage.classList.remove('show');
        }
    } else if (currentStage < 5 && correct < gameState.minCorrectToUnlock) {
        unlockMessage.textContent = `NEXT STAGE REQUIRES ${gameState.minCorrectToUnlock} CORRECT ANSWERS`;
        unlockMessage.classList.add('show');
    } else {
        unlockMessage.classList.remove('show');
    }
    
    showScreen('result-screen');
}

// 진행도 리셋
function resetProgress() {
    const confirmMessage = "지금까지 저장된 진행 상황이 전부 초기화됩니다. 진행도를 리셋하시겠습니까?";
    
    if (confirm(confirmMessage)) {
        // localStorage 초기화
        localStorage.removeItem('turingDeskProgress');
        
        // 모든 localStorage 항목 삭제 (캐시 완전 삭제)
        localStorage.clear();
        
        // 페이지 새로고침
        location.reload();
    }
}

// 이벤트 리스너 설정
document.addEventListener('DOMContentLoaded', () => {
    // 진행도 로드
    loadProgress();
    
    // 메인 화면 -> 스테이지 선택
    document.getElementById('start-btn').addEventListener('click', () => {
        showScreen('stage-select-screen');
    });
    
    // 스테이지 선택 -> 메인 화면
    document.getElementById('back-to-main-btn').addEventListener('click', () => {
        showScreen('main-screen');
    });
    
    // 리셋 버튼
    document.getElementById('reset-btn').addEventListener('click', () => {
        resetProgress();
    });
    
    // 스테이지 버튼 클릭
    document.querySelectorAll('.stage-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const stage = parseInt(e.target.dataset.stage);
            if (gameState.unlockedStages.includes(stage)) {
                showScreen('story-screen');
                showStory(stage);
            }
        });
    });
    
    // 통과 버튼
    document.getElementById('pass-btn').addEventListener('click', () => {
        if (!currentCharacter) return;
        
        const isCorrect = currentCharacter.isHuman;
        if (isCorrect) {
            gameState.correctCount++;
        } else {
            gameState.wrongCount++;
        }
        
        updateGameStats();
        generateNewCharacter();
    });
    
    // 거부 버튼
    document.getElementById('reject-btn').addEventListener('click', () => {
        if (!currentCharacter) return;
        
        const isCorrect = !currentCharacter.isHuman;
        if (isCorrect) {
            gameState.correctCount++;
        } else {
            gameState.wrongCount++;
        }
        
        updateGameStats();
        generateNewCharacter();
    });
    
    // 적외선 탐지 버튼
    document.getElementById('infrared-btn').addEventListener('click', () => {
        const fillBar = document.querySelector('.detection-fill');
        const isHuman = currentCharacter ? currentCharacter.isHuman : true;
        
        // 적외선 탐지 애니메이션
        let progress = 0;
        const interval = setInterval(() => {
            progress += 10;
            fillBar.style.width = progress + '%';
            
            if (progress >= 100) {
                clearInterval(interval);
                // 로봇이면 빨간색, 인간이면 초록색
                fillBar.style.background = isHuman 
                    ? 'linear-gradient(90deg, #00ff41 0%, #00cc33 100%)'
                    : 'linear-gradient(90deg, #ff4444 0%, #cc3333 100%)';
                
                // 2초 후 리셋
                setTimeout(() => {
                    fillBar.style.width = '0%';
                    fillBar.style.background = 'linear-gradient(90deg, #00ff41 0%, #00cc33 100%)';
                }, 2000);
            }
        }, 50);
    });
    
    // 대화 버튼들 (나중에 구현)
    document.getElementById('dialogue-btn-1').addEventListener('click', () => {
        console.log('대화 1 클릭');
    });
    
    document.getElementById('dialogue-btn-2').addEventListener('click', () => {
        console.log('대화 2 클릭');
    });
    
    document.getElementById('dialogue-btn-3').addEventListener('click', () => {
        console.log('대화 3 클릭');
    });
    
    // 게임 통계 업데이트 함수
    function updateGameStats() {
        document.getElementById('correct-count').textContent = gameState.correctCount;
        document.getElementById('wrong-count').textContent = gameState.wrongCount;
        document.getElementById('score').textContent = gameState.correctCount - gameState.wrongCount;
        
        // 테스트용: 20명 처리 후 게임 종료
        const total = gameState.correctCount + gameState.wrongCount;
        if (total >= 20) {
            setTimeout(() => {
                endGame(gameState.correctCount, gameState.wrongCount);
            }, 500);
        }
    }
    
    // 정산 화면 -> 재시도
    document.getElementById('retry-btn').addEventListener('click', () => {
        const stage = gameState.currentStage;
        showScreen('story-screen');
        showStory(stage);
    });
    
    // 정산 화면 -> 스테이지 선택
    document.getElementById('stage-select-result-btn').addEventListener('click', () => {
        updateStageButtons();
        showScreen('stage-select-screen');
    });
});

// 초기화
updateStageButtons();

