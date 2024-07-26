//selectors
const addBtn = document.querySelector(".add-citation-Btn");
const middleContainer = document.querySelector(".middle-container");
const citationsList = document.querySelector(".citations-list");
const addCitationBtn = document.querySelector(".form-Btn");
const textareaEl = document.querySelector(".textarea");
const authorInput = document.querySelector(".form-author-input");
const authorYear = document.querySelector(".form-year-input");
const searchInput = document.querySelector(".search-input");

//
const thumbsDown = document.querySelector(".ri-thumb-down-line");
const thumbsUp = document.querySelector(".ri-thumb-up-line");
const toolTip1 = document.querySelector(".tooltipText1");
const toolTip2 = document.querySelector(".tooltipText2");
const dropDownMenu = document.querySelector(".drop-menu");

const thumbsDownSpan = document.querySelector(".bot-number"); //bot numb
const thumbsUpSpan = document.querySelector(".tup-number"); // top span

let thumbsDownCount = localStorage.getItem("thumbsDownCount") || 0;
let thumbsUpCount = localStorage.getItem("thumbsUpCount") || 0;

//event listeners
addBtn.addEventListener("click", displayMiddleContainer);

addCitationBtn.addEventListener("click", addCitation);

document.addEventListener("DOMContentLoaded", getCitations);
dropDownMenu.addEventListener("change", filterCitations);
searchInput.addEventListener("keyup", Search);

//functions
function displayMiddleContainer() {
  middleContainer.style.display = "block";
}

function addCitation(e) {
  const citationText = textareaEl.value.trim();
  const authorName = authorInput.value.trim();
  const authoryear = authorYear.value.trim();
  const btnAfter = document.querySelector(".form-Btn");

  //check to see if inputs are not null
  if (citationText === "" || authorName === "" || authoryear === "") {
    e.preventDefault();
    btnAfter.classList.add("add");
    return;
  }

  // Generate a unique identifier for each citation
  const citationId = `citation-${new Date().getTime()}`;

  //container
  const citationContainer = document.createElement("div");
  citationContainer.classList.add("citation-container");
  citationContainer.dataset.id = citationId;

  //innerdiv 1
  const citationInner1 = document.createElement("div");
  citationInner1.classList.add("citation-inner1");

  //p1
  const inner1P1 = document.createElement("p");
  inner1P1.innerText = textareaEl.value;
  citationInner1.appendChild(inner1P1);

  //p2
  const inner1P2 = document.createElement("p");
  inner1P2.classList.add("inner1-p2");
  inner1P2.innerText = `${authorInput.value} - ${authorYear.value}`;
  citationInner1.appendChild(inner1P2);

  //innerdiv 2
  const citationInner2 = document.createElement("div");
  citationInner2.classList.add("citation-inner2");

  //topcont
  const topContainer = document.createElement("div");
  topContainer.classList.add("tup-cont");
  topContainer.dataset.likes = 0;
  const topNumber = document.createElement("span");
  topNumber.classList.add("tup-number");
  topNumber.innerHTML = 0; //thumbsUpCount;
  const tooltipText1 = document.createElement("span");
  tooltipText1.classList.add("tooltipText1");
  tooltipText1.innerText = "Liked!";
  const icon1 = document.createElement("i");
  icon1.classList.add("ri-thumb-up-line");

  // icon1.classList.add("ri-thumb-up-line");

  topContainer.appendChild(topNumber);
  topContainer.appendChild(icon1);
  topContainer.appendChild(tooltipText1);

  //botcont
  const bottomContainer = document.createElement("div");
  bottomContainer.classList.add("bot-cont");
  bottomContainer.dataset.dislikes = 0;
  const bottomNumber = document.createElement("span");
  bottomNumber.classList.add("bot-number");
  bottomNumber.innerHTML = 0; //thumbsDownCount;
  const tooltipText2 = document.createElement("span");
  tooltipText2.classList.add("tooltipText2");
  tooltipText2.innerText = "Disliked!";
  const icon2 = document.createElement("i"); // down
  icon2.classList.add("ri-thumb-down-line");

  // icon2.classList.add("ri-thumb-down-line");

  bottomContainer.appendChild(bottomNumber);
  bottomContainer.appendChild(icon2);
  bottomContainer.appendChild(tooltipText2);

  citationInner2.appendChild(topContainer);
  citationInner2.appendChild(bottomContainer);

  citationContainer.appendChild(citationInner1);
  citationContainer.appendChild(citationInner2);

  icon1.addEventListener("click", () => {
    let currentLikes = parseInt(topContainer.dataset.likes, 10);
    currentLikes++;
    topContainer.dataset.likes = currentLikes;
    topNumber.innerHTML = currentLikes;

    tooltipText1.classList.add("showTool");
    // localStorage.setItem(`${citationId}-likes`, currentLikes);
    setTimeout(() => {
      tooltipText1.classList.remove("showTool");
    }, 1000);
    updateLocalCitation(
      citationId,
      currentLikes,
      parseInt(bottomContainer.dataset.dislikes, 10)
    );
  });

  icon2.addEventListener("click", () => {
    let currentDislikes = parseInt(bottomContainer.dataset.dislikes, 10);
    currentDislikes++;
    bottomContainer.dataset.dislikes = currentDislikes;
    bottomNumber.innerHTML = currentDislikes;

    tooltipText2.classList.add("showTool");
    // localStorage.setItem(`${citationId}-dislikes`, currentDislikes);
    setTimeout(() => {
      tooltipText2.classList.remove("showTool");
    }, 1000);
    updateLocalCitation(
      citationId,
      parseInt(topContainer.dataset.likes, 10),
      currentDislikes
    );
  });
  saveLocalCitation(
    citationId,
    textareaEl.value,
    authorInput.value,
    authorYear.value,
    0,
    0
  );
  citationsList.appendChild(citationContainer);
  textareaEl.value = "";
  authorInput.value = "";
  authorYear.value = "";
}

function update() {
  let gettDownCount = localStorage.getItem("thumbsDownCount");
  let gettUpCount = localStorage.getItem("thumbsUpCount");
  if (gettDownCount) {
    thumbsDownSpan.innerHTML = gettDownCount;
  }
  if (gettUpCount) {
    thumbsUpSpan.innerHTML = gettUpCount;
  }
  thumbsDownSpan.classList.remove("hidden");
  thumbsUpSpan.classList.remove("hidden");
}
// localStorage.clear();
function saveLocalCitation(id, citation, author, year, likes, dislikes) {
  let citations;
  if (localStorage.getItem("citations") === null) {
    citations = [];
  } else {
    citations = JSON.parse(localStorage.getItem("citations"));
  }
  citations.push({
    id: id,
    citation: citation,
    author: author,
    year: year,
    likes: likes,
    dislikes: dislikes,
  });
  localStorage.setItem("citations", JSON.stringify(citations));
}

const citations = JSON.parse(localStorage.getItem("citations"));
console.log(citations);
// console.log(citations[2].id > citations[0]);

// console.log(mostRecent);

function updateLocalCitation(id, likes, dislikes) {
  let citations = JSON.parse(localStorage.getItem("citations"));
  for (let i = 0; i < citations.length; i++) {
    if (citations[i].id === id) {
      citations[i].likes = likes;
      citations[i].dislikes = dislikes;
      break;
    }
  }
  localStorage.setItem("citations", JSON.stringify(citations));
}
function getCitations() {
  let citations;
  if (localStorage.getItem("citations") === null) {
    citations = [];
  } else {
    citations = JSON.parse(localStorage.getItem("citations"));
  }
  citations.forEach((citation) => {
    // Generate a unique identifier for each citation
    const citationId = citation.id;

    //container
    const citationContainer = document.createElement("div");
    citationContainer.classList.add("citation-container");
    citationContainer.dataset.id = citationId;

    //innerdiv 1
    const citationInner1 = document.createElement("div");
    citationInner1.classList.add("citation-inner1");

    //p1
    const inner1P1 = document.createElement("p");
    inner1P1.innerText = citation.citation;
    citationInner1.appendChild(inner1P1);

    //p2
    const inner1P2 = document.createElement("p");
    inner1P2.classList.add("inner1-p2");
    inner1P2.innerText = `${citation.author} - ${citation.year}`;
    citationInner1.appendChild(inner1P2);

    //innerdiv 2
    const citationInner2 = document.createElement("div");
    citationInner2.classList.add("citation-inner2");

    //topcont
    const topContainer = document.createElement("div");
    topContainer.classList.add("tup-cont");
    topContainer.dataset.likes = citation.likes;
    const topNumber = document.createElement("span");
    topNumber.classList.add("tup-number");
    topNumber.innerHTML = citation.likes;
    const tooltipText1 = document.createElement("span");
    tooltipText1.classList.add("tooltipText1");
    tooltipText1.innerText = "Liked!";
    const icon1 = document.createElement("i");
    icon1.classList.add("ri-thumb-up-line");

    // icon1.classList.add("ri-thumb-up-line");

    topContainer.appendChild(topNumber);
    topContainer.appendChild(icon1);
    topContainer.appendChild(tooltipText1);

    //botcont
    const bottomContainer = document.createElement("div");
    bottomContainer.classList.add("bot-cont");
    bottomContainer.dataset.dislikes = citation.dislikes;
    const bottomNumber = document.createElement("span");
    bottomNumber.classList.add("bot-number");
    bottomNumber.innerHTML = citation.dislikes;
    const tooltipText2 = document.createElement("span");
    tooltipText2.classList.add("tooltipText2");
    tooltipText2.innerText = "Disliked!";
    const icon2 = document.createElement("i"); // down
    icon2.classList.add("ri-thumb-down-line");

    // icon2.classList.add("ri-thumb-down-line");

    bottomContainer.appendChild(bottomNumber);
    bottomContainer.appendChild(icon2);
    bottomContainer.appendChild(tooltipText2);

    citationInner2.appendChild(topContainer);
    citationInner2.appendChild(bottomContainer);

    citationContainer.appendChild(citationInner1);
    citationContainer.appendChild(citationInner2);

    icon1.addEventListener("click", () => {
      let currentLikes = parseInt(topContainer.dataset.likes, 10);
      currentLikes++;
      topContainer.dataset.likes = currentLikes;
      topNumber.innerHTML = currentLikes;

      tooltipText1.classList.add("showTool");
      // localStorage.setItem(`${citationId}-likes`, currentLikes);
      setTimeout(() => {
        tooltipText1.classList.remove("showTool");
      }, 1000);
      updateLocalCitation(
        citationId,
        currentLikes,
        parseInt(bottomContainer.dataset.dislikes, 10)
      );
    });

    icon2.addEventListener("click", () => {
      let currentDislikes = parseInt(bottomContainer.dataset.dislikes, 10);
      currentDislikes++;
      bottomContainer.dataset.dislikes = currentDislikes;
      bottomNumber.innerHTML = currentDislikes;

      tooltipText2.classList.add("showTool");
      // localStorage.setItem(`${citationId}-dislikes`, currentDislikes);
      setTimeout(() => {
        tooltipText2.classList.remove("showTool");
      }, 1000);
      updateLocalCitation(
        citationId,
        parseInt(topContainer.dataset.likes, 10),
        currentDislikes
      );
    });

    citationsList.appendChild(citationContainer);
  });
}

function filterCitations(e) {
  const citations = JSON.parse(localStorage.getItem("citations"));
  citations.sort((a, b) => a.id.localeCompare(b.id));

  let maxLike = 0;
  let MostLiked = [];
  let maxDislike = 0;
  let MostDisliked = [];
  let mostRecent = citations[0];
  let mostrecentArray = [];

  //most liked
  citations.forEach((citation) => {
    const likes = parseInt(citation.likes, 10);
    if (likes > maxLike) {
      maxLike = likes;
      MostLiked = [citation];
    } else if (likes === maxLike) {
      MostLiked.push(citation);
    }
  });

  //most disliked
  citations.forEach((citation) => {
    const dislikes = parseInt(citation.dislikes, 10);
    if (dislikes > maxDislike) {
      maxDislike = dislikes;
      MostDisliked = [citation];
    } else if (dislikes === maxDislike) {
      MostDisliked.push(citation);
    }
  });

  citations.forEach((citation) => {
    const recent = citation;
    if (recent.id > mostRecent.id) {
      mostRecent = recent;
      mostrecentArray = [citation];
    }
  });

  const citationElements = Array.from(citationsList.children);
  citationElements.forEach((citationELement) => {
    const citationId = citationELement.dataset.id;
    const isMostLiked = MostLiked.some(
      (citation) => citation.id === citationId
    );
    const isMostDisliked = MostDisliked.some(
      (citation) => citation.id === citationId
    );
    const isMostRecent = mostrecentArray.some(
      (citation) => citation.id === citationId
    );

    switch (e.target.value) {
      case "all":
        citationELement.style.display = "flex";
        break;
      case "most liked":
        citationELement.style.display = isMostLiked ? "flex" : "none";
        break;
      case "most disliked":
        citationELement.style.display = isMostDisliked ? "flex" : "none";
        break;
      case "most recent citation":
        citationELement.style.display = isMostRecent ? "flex" : "none";
        break;
      case "oldest citation":
        const oldest = citations[0];
        citationELement.style.display =
          oldest.id === citationId ? "flex" : "none";
        break;
    }
  });
}

function Search() {
  const searchInput = document.querySelector(".search-input");

  // const pText = citationsList.getElementsByTagName("p");
  // console.log(searchInput);
  if (!searchInput) return;
  const searchValue = searchInput.value.toUpperCase();
  const citationContainers = document.querySelectorAll(".citation-container");
  citationContainers.forEach((container) => {
    const pTags = container.querySelectorAll("p");
    let matchFound = false;

    pTags.forEach((p) => {
      const textvalue = p.textContent.toUpperCase();
      const index = textvalue.indexOf(searchValue);
      if (index > -1) {
        matchFound = true;
        const originalText = p.textContent;
        const beforeMatch = originalText.slice(0, index);
        const matchText = originalText.slice(index, index + searchValue.length);
        const afterMatch = originalText.slice(index + searchValue.length);

        const highlithedText = `${beforeMatch}<span class='color'>${matchText}</span>${afterMatch}`;
        // console.log(highlithedText);
        p.innerHTML = highlithedText;
      } else {
        p.innerHTML = p.textContent;
      }
    });
    if (matchFound) {
      container.style.display = "";
    } else {
      container.style.display = "none";
    }
  });
}
