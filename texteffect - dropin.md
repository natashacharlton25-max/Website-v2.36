<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Turning Obstacles Into Opportunities</title>
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@800&display=swap" rel="stylesheet">
  <style>
    /* ===== Prevent ALL scrolling and adapt to any viewport ===== */
    html, body {
      margin: 0;
      padding: 0;
      width: 100vw;
      height: 600px;
      overflow: hidden;
      background: transparent;
    }

    /* ===== Core layout ===== */
    body {
      font-family: 'Montserrat', sans-serif;
      font-weight: 800;
      display: flex;
      justify-content: flex-start;
      align-items: flex-start;
    }

    .container {
      padding-left: 30px;
      padding-top: 40px;
    }

    .word-line {
      display: flex;
      white-space: nowrap;
      margin: 30px 0;
      font-size: 7vw;
      line-height: 1;
      transform-style: preserve-3d;
    }

    .letter {
      display: inline-block;
      margin-right: 0.3vw;
      text-align: left;
      opacity: 0;
      transform: translate(0,0) rotate(0deg);
      transition: transform 1s ease, opacity 1s ease, color 0.5s ease;
      position: relative;
      z-index: 1;
      backface-visibility: hidden;
      transform-style: preserve-3d;
    }

    /* ===== Final colors ===== */
    .turning .letter.final       { color: #f8b56e; }
    .obstacles .letter.final     { color: #ff0054; }
    .into .letter.final          { color: #142670; }
    .opportunities .letter.final { color: #32b1b5; }

    /* ===== Hover animations ===== */
    .letter.final.hover-balance:hover     { animation: balance 3s ease-out; }
    .letter.final.hover-shrinkjump:hover  { animation: shrinkjump 3s ease-in-out; }
    .letter.final.hover-falling:hover     { animation: falling 3.5s ease-out; }
    .letter.final.hover-rotate:hover      { animation: rotate 3s ease-out; }
    .letter.final.hover-toplong:hover     { animation: toplong 3.5s linear; }

    @keyframes balance { 0%,100%{transform:rotate(0deg);}30%,60%{transform:rotate(-45deg);} }
    @keyframes shrinkjump {10%,35%{transform:scale(2,.2);}45%,50%{transform:scale(1) translateY(-100px);}80%{transform:scale(1) translateY(0);} }
    @keyframes falling {0%{transform:translateY(-100px) rotateX(0deg);opacity:0;}20%{opacity:1;transform:translateY(0) rotateX(200deg);}40%{transform:translateY(0) rotateX(150deg);}60%{transform:translateY(0) rotateX(200deg);}80%{transform:translateY(0) rotateX(175deg);}100%{transform:translateY(0) rotateX(0deg);} }
    @keyframes rotate {0%{transform:rotateY(0deg);}50%{transform:rotateY(360deg);}100%{transform:rotateY(0deg);} }
    @keyframes toplong {0%{transform:translateY(0);}30%{transform:translateY(-30vh) scaleY(1);}60%{transform:translateY(-30vh) scaleY(4);}100%{transform:translateY(0) scaleY(1);} }

    /* ===== Mobile tweaks (optional) ===== */
    @media (max-width:768px){
      .container { padding-left:0; padding-top:20px; }
      .word-line { font-size:20pt; margin:10px 0; }
      .letter { margin-right:4px; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="word-line turning" data-word="TURNING"></div>
    <div class="word-line obstacles" data-word="OBSTACLES"></div>
    <div class="word-line into" data-word="INTO"></div>
    <div class="word-line opportunities" data-word="OPPORTUNITIES"></div>
  </div>
  <script>
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const finalColors = ["#f8b56e","#ff0054","#142670","#32b1b5"];
    const hoverClasses = ['hover-balance','hover-shrinkjump','hover-falling','hover-rotate','hover-toplong'];
    const lines = document.querySelectorAll('.word-line');
    let totalLetters = 0, lettersLanded = 0;

    function shuffle(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    }

    function dropLetters() {
      lines.forEach((line, li) => {
        const word = line.dataset.word;
        totalLetters += word.length;
        let prevHover = null;

        [...word].forEach((char, idx) => {
          const span = document.createElement('span');
          span.className = 'letter';
          span.dataset.index = idx;

          // random placeholder
          let wrong;
          do { wrong = chars[Math.floor(Math.random() * chars.length)]; }
          while (wrong === char);
          span.textContent = wrong;
          span.style.color = '#888';
          span.style.transform = `translate(${Math.random()*500-250}px, ${Math.random()*500-250}px) rotate(${Math.random()*360-180}deg)`;

          // varied hover effect
          const available = hoverClasses.filter(c => !(idx < 2 && c === 'hover-balance') && c !== prevHover);
          const hoverClass = available[Math.floor(Math.random() * available.length)];
          prevHover = hoverClass;
          span.dataset.hover = hoverClass;

          line.appendChild(span);

          setTimeout(() => {
            span.style.opacity = '1';
            span.style.transform = 'translate(0,0) rotate(0deg)';
            lettersLanded++;
            if (lettersLanded === totalLetters) {
              setTimeout(finalReveal, 1500);
            }
          }, 500 + li*800 + idx*300);
        });
      });
    }

    function finalReveal() {
      const allLetters = Array.from(document.querySelectorAll('.letter'));
      const shuffled = shuffle(allLetters);
      shuffled.forEach((span, i) => {
        setTimeout(() => {
          const parent = span.parentElement;
          const word = parent.dataset.word;
          const idx = parseInt(span.dataset.index, 10);
          span.textContent = word[idx];
          span.classList.add('final');
          span.style.color = finalColors[['turning','obstacles','into','opportunities'].indexOf(parent.classList[1])];
          span.classList.add(span.dataset.hover);
        }, i * 400);
      });
    }

    dropLetters();
  </script>
</body>
</html>
