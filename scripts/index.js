// Variables

// Document Title
const pageTitle = document.querySelector('[data-titleText');

// Cards
const welcomeCard = document.querySelector('[data-pageName=Welcome');
const createAccountCard = document.querySelector('[data-pageName=Create');
const greetingtCard = document.querySelector('[data-pageName=Greeting');
const allCards = document.querySelectorAll('[data-pageName');

// Buttons
const getStartedBtn = document.getElementById('get-started');
const createAccBtn = document.getElementById('create');

// Inputs
const usernameInput = document.querySelector('[data-username]');
const emailInput = document.querySelector('[data-email]');
const passwordInput = document.querySelector('[data-password]');
const confirmPasswordInput = document.querySelector('[data-confirmPassword]');

// Data
const APIData = {
  username: '',
  email: '',
  password: '',
  password_confirmation: ''
};
/////////////////////////////
// Functions

// Helper Functions
function handleRendering(toBeRendered) {
  // Render The Passed Card
  allCards.forEach(card => card.classList.add('hidden'));
  toBeRendered.classList.remove('hidden');

  // Change The Title Element Text
  const titleText = toBeRendered.getAttribute('[data-pageName]');
  pageTitle.textContent = titleText;
}

function usernameValidating(username) {
  const regEx = /^[a-z]([a-z0-9]{3,13})[a-z]$/ig;
  const isValidUsername = regEx.test(username);

  if (isValidUsername) {
    APIData.username = username;
  } else {
    return `Username must consist of 5 to 15 characters, only letters and numbers are allowed, with no
    numbers at the beginning or the end`;
  };
}

function emailValidating(email) {
  const regEx = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/ig;
  const isValidEmail = regEx.test(email);

  if (isValidEmail) {
    APIData.email = email;
  } else {
    return `Please Provide a Valid Email`;
  }
}

function passwordValidating(password) {
  const regEx = /[A-Za-z\d*\w*\s*?*=*\-*]{8,}/gm;
  if (regEx.test(password)) {
    APIData.password = password;
  } else {
    return `The Password must contain at least one uppercase, lowercase letter, number, symbol and minimum 8 characters.`;
  }
}

function confirmPasswordValidating(password, confirmPassword) {
  if (password === confirmPassword) {
    APIData.password_confirmation = confirmPassword;
  } else {
    return `Password Isn't Matching`;
  }
}

function renderErrorMessage(result, event) {
  const errorEl = event.target.parentElement.children[1];

  errorEl.textContent = result;
  errorEl.classList.add('toggle');

  if (errorEl.classList.contains('toggle')) {
    setTimeout(() => {
      errorEl.classList.remove('toggle');
    }, 4000);
  }
}

async function sendDataToServer(dataObj) {
  try {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      Accept: 'application/json',
      body: JSON.stringify(dataObj)
    };
    const URL = 'https://goldblv.com/api/hiring/tasks/register';

    const res = await fetch(URL, options);
    const data = await res.json();

    return data;
  } catch (error) {
    return error;
  }
}

////////////////////////////////
// Main Functions
function renderCreateAccountCard() {
  handleRendering(createAccountCard);
}

function checkUsername(event) {
  const result = usernameValidating(event.target.value);

  if (typeof result === 'string') {
    renderErrorMessage(result, event);
  }
}

function checkEmail(event) {
  const result = emailValidating(event.target.value);

  if (typeof result === 'string') {
    renderErrorMessage(result, event);
  }
}

function checkPassword(event) {
  const result = passwordValidating(event.target.value);

  if (typeof result === 'string') {
    renderErrorMessage(result, event);
  }
}

function checkConfirmation(event) {
  const result = confirmPasswordValidating(APIData.password, event.target.value);

  if (typeof result === 'string') {
    renderErrorMessage(result, event);
  }
}

function handleUserData(event) {
  event.preventDefault();

  for (const [key, value] of Object.entries(APIData)) {
    if (!value) return;
  }

  sendDataToServer(APIData).then((res, rej) => {
    if (res.email) {
      document.querySelector('[data-userEmail]').textContent = res.email;

      handleRendering(greetingtCard);
    } else if (rej.errors) {
      const errorMessage = rej.errors.password.join(' ');

      renderErrorMessage(errorMessage, passwordInput);
    } else {
      console.log(rej);
    }
  });
}
// Event Listeners
getStartedBtn.addEventListener('click', renderCreateAccountCard);

usernameInput.addEventListener('change', checkUsername);
emailInput.addEventListener('change', checkEmail);
passwordInput.addEventListener('change', checkPassword);
confirmPasswordInput.addEventListener('change', checkConfirmation);

createAccBtn.addEventListener('click', handleUserData);