const url = "https://randomuser.me/api";

let peopleLst = [];

let isLoading = false;

const getRandomPerson = async () => {
  const loader = document.getElementById("loader");
  loader.classList.remove("not-loading")
  await fetchPeople();
  loader.classList.add("not-loading")
  peopleLst.forEach((el) => {
    const personData = [];

    personData.push(el.cell);
    personData.push(el?.location?.city);
    personData.push(el.email);
    personData.push(el?.location?.coordinates?.latitude);
    personData.push(el?.location?.coordinates?.longitude);

    const personDiv = document.createElement("div");
    const peopleGrid = document.getElementById("people-grid");
    personDiv.className = "person-div";

    const personImage = document.createElement("img");
    personImage.src = el.picture.large;

    personDiv.appendChild(personImage);

    personData.forEach((el) => {
      let p = document.createElement("p");
      p.innerHTML += el;
      personDiv.appendChild(p);
    });

    peopleGrid.appendChild(personDiv);
  });
};

const fetchPeople = async () => {
  peopleLst = [];
  for (let index = 0; index < 5; index++) {
    let response = await fetch(url);
    let data = await response.json();
    const personData = data?.results[0];
    peopleLst.push(personData);
  }
};
