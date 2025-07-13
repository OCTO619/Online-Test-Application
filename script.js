let questions = [];
let answers = {};
let userAnswers = {};

async function loadQuiz() {
  const qRes = await fetch('questions.json');
  questions = await qRes.json();

  const container = document.getElementById('quiz-container');
  questions.forEach((q, index) => {
    const div = document.createElement('div');
    div.className = 'question';
    div.innerHTML = `<p><strong>Q${index + 1}: ${q.question}</strong></p>`;

    q.options.forEach((opt) => {
      div.innerHTML += `
        <div class="options">
          <input type="radio" name="q${q.id}" value="${opt}" />
          ${opt}
        </div>
      `;
    });

    container.appendChild(div);
  });
}

async function submitQuiz() {
  const aRes = await fetch('answers.json');
  answers = await aRes.json();

  questions.forEach(q => {
    const selected = document.querySelector(`input[name="q${q.id}"]:checked`);
    userAnswers[q.id] = selected ? selected.value : null;
  });

  evaluate();
}

function evaluate() {
  let score = 0;
  let total = questions.length;
  let resultHTML = "<h2>Results:</h2>";

  questions.forEach(q => {
    const correct = answers[q.id];
    const user = userAnswers[q.id];
    if (user === correct) score++;

    resultHTML += `
      <p>
        <strong>Q: ${q.question}</strong><br/>
        Your answer: ${user || "Not answered"}<br/>
        Correct answer: ${correct}<br/>
        ${user === correct ? "✅ Correct" : "❌ Incorrect"}
      </p>
    `;
  });

  resultHTML = `<h2>Score: ${score} / ${total}</h2>` + resultHTML;
  document.getElementById('result-container').innerHTML = resultHTML;
}

loadQuiz();
