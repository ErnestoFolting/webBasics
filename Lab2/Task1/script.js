function validateForm(form) {
  var fullname = form.fullname;
  var group = form.group;
  var phoneNumber = form.phoneNumber;
  var address = form.address;
  var email = form.email;

  console.log("check");
  console.log(fullname.value);
  console.log(fullname.classList);

  var correctFlag = true;

  fullname.classList?.remove("error");
  group.classList?.remove("error");
  phoneNumber.classList?.remove("error");
  address.classList?.remove("error");
  email.classList?.remove("error");

  // Перевірка, чи всі поля заповнені
  if (
    fullname.value === "" ||
    group.value === "" ||
    phoneNumber.value === "" ||
    address.value === "" ||
    email.value === ""
  ) {
    correctFlag = false;
    alert("Будь ласка, заповніть всі поля.");
  }

  // Перевірка формату ПІБ
  var fullNameRegex =
    /^[A-Za-zА-Яа-яЁё]+\s[A-Za-zА-Яа-яЁё]\.?\s?[A-Za-zА-Яа-яЁё]\.$/;
  if (!fullNameRegex.test(fullname.value)) {
    fullname.classList.add("error");
    correctFlag = false;
  }

  // Перевірка формату групи
  var groupRegex = /^[\p{L}\d]+-[\d]{2}$/u;
  if (!groupRegex.test(group.value)) {
    group.classList.add("error");
    correctFlag = false;
  }

  // Перевірка формату номеру телефону
  var phoneRegex = /^380\d{9}$/;
  if (!phoneRegex.test(phoneNumber.value)) {
    phoneNumber.classList.add("error");
    correctFlag = false;
  }

  // Перевірка формату адреси
  var addressRegex = /^(м\.|с\.|смт\.)\s[\p{Lu}\p{Ll}\d\s]+$/u;
  if (!addressRegex.test(address.value)) {
    address.classList.add("error");
    correctFlag = false;
  }

  // Перевірка формату електронної пошти
  var emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
  if (!emailRegex.test(email.value)) {
    email.classList.add("error");
    correctFlag = false;
  }

  if (correctFlag) {
    document.getElementById("success-message").style.display = "block";

    document.getElementById("fullname-div").textContent = fullname.value
    document.getElementById("group-div").textContent = group.value
    document.getElementById("phoneNumber-div").textContent = phoneNumber.value
    document.getElementById("address-div").textContent = address.value
    document.getElementById("email-div").textContent = email.value

    fullname.value = "";
    group.value = "";
    phoneNumber.value = "";
    address.value = "";
    email.value = "";
  } else {
    document.getElementById("success-message").style.display = "none";
  }

  return false;
}
