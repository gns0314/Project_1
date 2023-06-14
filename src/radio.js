<<<<<<< HEAD
// 선택된 요리 타입을 저장할 변수
export let cuisineType = "한식";

// radio 버튼 변경 이벤트 처리
document.querySelectorAll('input[name="type"]').forEach((radio) => {
  radio.addEventListener("change", (e) => {
    cuisineType = e.target.value;
  });
});
=======
// 선택된 요리 타입을 저장할 변수
export let cuisineType = "한식";

// radio 버튼 변경 이벤트 처리
document.querySelectorAll('input[name="type"]').forEach((radio) => {
  radio.addEventListener("change", (e) => {
    cuisineType = e.target.value;
  });
});
>>>>>>> 1d5aa172b2fe8253ad0596ddef1fdec763213079
