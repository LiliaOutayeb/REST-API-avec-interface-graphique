const API = "http://localhost:5001";

function showPopup(data) {
  document.getElementById("popupResult").textContent = JSON.stringify(
    data,
    null,
    2
  );
  document.getElementById("popup").style.display = "flex";
}
function closePopup() {
  document.getElementById("popup").style.display = "none";
}

function updateServiceUI() {
  ["getUI", "postUI", "patchUI", "deleteUI"].forEach((id) =>
    document.getElementById(id).classList.add("hidden")
  );
  const val = document.getElementById("serviceType").value;
  if (val)
    document
      .getElementById(val.toLowerCase() + "UI")
      .classList.remove("hidden");
}

async function getAllPersons() {
  const res = await fetch(`${API}/persons`);
  showPopup(await res.json());
}
async function getAllCities() {
  const res = await fetch(`${API}/cities`);
  showPopup(await res.json());
}

async function executeGet() {
  const action = document.getElementById("getAction").value;
  const p = document.getElementById("getParam1").value;
  let url = "";

  if (action === "persons") url = "/persons";
  if (action === "personsFields") url = `/persons?fields=${p}`;
  if (action === "personsSorted") url = `/persons?sort=${p}`;
  if (action === "personById") url = `/persons/${p}`;
  if (action === "personByName") url = `/persons?name=${p}`;
  if (action === "cities") url = "/cities";
  if (action === "cityById") url = `/cities/${p}`;

  const res = await fetch(API + url);
  showPopup(await res.json());
}

async function executePost() {
  const type = document.getElementById("postType").value;
  let body = { id: postId.value, name: postName.value };
  let url = "/persons";

  if (type === "city") {
    url = "/cities";
    body.area = postArea.value;
    body.population = postPopulation.value;
  }

  const res = await fetch(API + url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  showPopup(await res.json());
}

async function executePatch() {
  const id = patchPersonId.value;
  const value = patchValue.value;
  const action = patchAction.value;
  let body = {};

  if (action === "name") body.name = value;
  if (action === "addCity") body.addCityId = value;
  if (action === "removeCity") body.removeCityId = value;

  const res = await fetch(`${API}/persons/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  showPopup(await res.json());
}

async function executeDelete() {
  const id = deleteId.value;
  const type = deleteType.value;
  const url = type === "person" ? `/persons/${id}` : `/cities/${id}`;

  const res = await fetch(API + url, { method: "DELETE" });
  showPopup(await res.json());
}
