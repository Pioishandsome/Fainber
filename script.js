const resultbox = document.getElementById("result");
const fabname = document.getElementById("fabname");
const fabreason = document.getElementById("fabreason");
const findbutton = document.getElementById("findbutton");

const styleInput = document.getElementById("style");
const seasonSelect = document.getElementById("season");
const purposeInput = document.getElementById("purpose");
const additionalInput = document.getElementById("additional");


findbutton.addEventListener("click", async function () {

    // 사용자 입력 가져오기
    const style = styleInput.value.trim();
    const season = seasonSelect.value;
    const purpose = purposeInput.value.trim();
    const additional = additionalInput.value.trim();


    // 입력값 확인
    if (!style || !season || !purpose) {
        alert("Please fill in all required fields.");
        return;
    }


    // 결과 화면 표시
    resultbox.classList.remove("hidden");

    fabname.textContent = "Finding...";
    fabreason.textContent = "Finding the best fabric for you...";


    // 버튼 비활성화
    findbutton.disabled = true;


    try {

        // 서버에 사용자 입력 전달
        const response = await fetch("/api/recommend", {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                style: style,
                season: season,
                purpose: purpose,
                additional: additional
            })
        });


        // 서버 응답 받기
        const data = await response.json();


        // 오류 확인
        if (!response.ok) {
            throw new Error(
                data.error || "Something went wrong."
            );
        }


        // 결과 표시
        fabname.textContent = "AI Fabric Recommendation";

        fabreason.textContent = data.recommendation;
        let formattedRecommendation = data.recommendation;

formattedRecommendation = formattedRecommendation
    .replace(/\s+(1\.\s)/g, "\n\n$1")
    .replace(/\s+(2\.\s)/g, "\n\n$1")
    .replace(/\s+(3\.\s)/g, "\n\n$1")
    .replace(/\s+(4\.\s)/g, "\n\n$1");

fabreason.textContent = formattedRecommendation;


    } catch (error) {

        console.error("Error:", error);

        fabname.textContent = "Failed";

        fabreason.textContent = error.message;


    } finally {

        // 버튼 다시 활성화
        findbutton.disabled = false;

    }

});