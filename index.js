const $form = document.querySelector("form");
const $input = document.querySelector("input");
const $chatList = document.querySelector("ul");

// openAI API
let url = `https://estsoft-openai-api.jejucodingcamp.workers.dev/`;

// 사용자의 질문
let question;

// input에 입력된 값을 저장할 변수
let ingredient;

// 선택된 요리 타입을 저장할 변수
let cuisineType = "한식";

// 추천받을 가지수 저장할 변수
let num;

// 추가 질문 값을 저장할 변수
let additional;

// 질문과 답변 저장
let data = [
  {
    role: "system",
    content: "assistant는 유능한 요리사이다.",
  },
];

// 화면에 뿌려줄 데이터, 질문들
let questionData = [];

// 전역 변수로 추가 질문을 담는 div 생성
let additionalQuestionDiv;

// input에 입력된 질문 받아오는 함수
$input.addEventListener("input", (e) => {
  question = e.target.value;
});

// radio 버튼 변경 이벤트 처리
document.querySelectorAll('input[name="type"]').forEach((radio) => {
  radio.addEventListener("change", (e) => {
    cuisineType = e.target.value;
  });
});

// 사용자의 질문을 객체를 만들어서 push
const sendQuestion = (question) => {
  if (question) {
    data.push({
      role: "user",
      content: question,
    });
    questionData.push({
      role: "user",
      content: question,
    });
  }
};

// 화면에 질문 그려주는 함수
const printQuestion = async () => {
  if (questionData.length > 0) {
    const li = document.createElement("li");
    li.classList.add("question");
    questionData.forEach((el) => {
      const span = document.createElement("span");
      span.innerText = el.content;
      li.appendChild(span);
    });
    $chatList.appendChild(li);
    questionData = [];
    question = false;
  }
};

// 화면에 답변 그려주는 함수
const printAnswer = async (answer) => {
  let li = document.createElement("li");
  li.classList.add("answer");
  li.innerText = answer;
  $chatList.appendChild(li);

  // 추가 질문을 담는 div가 없을 경우에만 생성
  if (!additionalQuestionDiv) {
    // 상세히 보고싶은 레시피 입력
    let input1 = document.createElement("input");
    input1.addEventListener("input", (e) => {
      additional = e.target.value;
    });
    let label = document.createElement("label");
    label.setAttribute("for", "add");
    label.setAttribute(
      "class",
      "block text-gray-700 text-sm font-bold mb-2 text-xl"
    );
    label.innerText = "상세히 보고싶은 레시피를 적으세요";
    input1.setAttribute("type", "text");
    input1.setAttribute("name", "add");
    input1.setAttribute("id", "add");
    input1.setAttribute("placeholder", "ex)2.탕수육");
    input1.setAttribute(
      "class",
      "block appearance-none w-1/2 bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline mb-4"
    );

    // 추가 질문을 전송할 수 있는 버튼 생성
    let additionalQuestionInput = document.createElement("button");
    additionalQuestionInput.type = "submit";
    additionalQuestionInput.setAttribute(
      "class",
      "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-1/2 mt-4"
    );
    additionalQuestionInput.innerText = "전송";

    // 추가 질문을 담는 div 생성
    additionalQuestionDiv = document.createElement("div");
    additionalQuestionDiv.setAttribute("class", "additional");
    additionalQuestionDiv.appendChild(label);
    additionalQuestionDiv.appendChild(input1);
    additionalQuestionDiv.appendChild(additionalQuestionInput);

    $form.appendChild(additionalQuestionDiv);
  }
};

// api 요청보내는 함수
const apiPost = async () => {
  const result = await axios({
    method: "post",
    maxBodyLength: Infinity,
    url: url,
    headers: {
      "Content-Type": "application/json",
    },
    data: JSON.stringify(data),
  });
  try {
    console.log(result.data);
    printAnswer(result.data.choices[0].message.content);
  } catch (err) {
    console.log(err);
  }
};

// submit
$form.addEventListener("submit", (e) => {
  e.preventDefault();

  if (additional) {
    // 추가 질문이 있는 경우
    $input.value = null;
    sendQuestion(
      `너가 위에서 추천해준 ${additional}에 대한 자세한 레시피를 알고싶어`
    );
  } else {
    // 추가 질문이 없는 경우
    ingredient = $input.value;
    num = document.getElementById("num").value;
    sendQuestion(
      `냉장고에 ${ingredient}가 있고 나는 ${cuisineType}을 만들고 싶어 ${ingredient}로 만들 수 있는 ${cuisineType}을 ${num}가지 추천해줘.`
    );
  }

  printQuestion();
  apiPost();
});
