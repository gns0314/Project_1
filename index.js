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

// kakao img api
// input 값이 변경될 때마다 kakaoImgApiInsert 함수 호출
$form.addEventListener("submit", function handleFormSubmit(event) {
  event.preventDefault(); // 폼 제출 기본 동작 막기
  kakaoImgApiInsert();
  $form.removeEventListener("submit", handleFormSubmit); // 이벤트 리스너 제거
});

// 이미지 삽입 함수
function kakaoImgApiInsert() {
  const foodType = cuisineType;
  let page;

  // switch 문을 사용하여 foodType 값에 따라 page 값을 설정
  switch (foodType) {
    case "한식":
      page = 1;
      break;
    case "일식요리":
      page = 2;
      break;
    case "중식":
      page = 5;
      break;
    case "양식요리":
      page = 3;
      break;
    default:
      page = 1;
      break;
  }

  //https://developers.kakao.com/tool/rest-api/open/get/v2-search-image
  $.ajax({
    type: "GET",
    url: "https://dapi.kakao.com/v2/search/image",
    headers: {
      Authorization: "KakaoAK 1ae7763bfd5906ae723a040cd42f2538", // 'KakaoAK 0000000000000000000000000000000000'
    },
    data: {
      query: `${foodType}`,
      sort: "accuracy", //accuracy(정확도순) 또는 recency(최신순)
      page: page, //결과 페이지 번호, 1~50 사이의 값, 기본 값 1
      size: 1, //한 페이지에 보여질 문서 수, 1~80 사이의 값, 기본 값 80
    },
    success: function (jdata) {
      //console.log(jdata);
      $(jdata.documents).each(function (index) {
        $("div#content").append('<img src="' + this.image_url + '"/>');
      });
    },
    error: function (xhr, textStatus) {
      console.log(xhr.responseText);
      console.log("에러");
      return;
    },
  });
}
