document.addEventListener("DOMContentLoaded", (event) => {
  const inputForm = document.getElementById('inputForm');
  const outputContainer = document.getElementById('outputContainer');

  inputForm.addEventListener('submit', (event) => {
    event.preventDefault();

    outputContainer.innerHTML = wpLoadingSkeleton;

    // Get the inputUrl url
    let inputUrl = document.getElementById('inputUrl').value;

    // Check if its wordpress
    fetch(`https://api.wp-detector.com/index.php?url=${inputUrl}`)
      .then(response => response.json())
      .then(data => {
        if (data.wordpress === "yes") {
          outputContainer.innerHTML = wpDetectSuccess;
        } else if (data.wordpress === "no") {
          outputContainer.innerHTML = wpDetectFail;
        }
      })
  });
});

// Cards
const wpDetectSuccess = `
<div class="card card__wp border">
  <img src="/wordpress-detector-success.svg" alt="Success Logo" class="card--icon" width="75" height="60" />
  <div>
    <h4 class="card--title cart--title__success">Hurray!</h4>
    <p><strong>elementor.com</strong> is using WordPress!</p>
  </div>
</div>`;

const wpDetectFail = `
<div class="card card__wp border">
  <img src="/wordpress-detector-fail.svg" alt="Success Logo" class="card--icon" width="75" height="60" />
  <div>
    <h4 class="card--title cart--title__fail">Bad news...</h4>
    <p><strong>google.com</strong> is not using WordPress.</p>
  </div>
</div>`;

const htmlRetrieveError = `
<div class="card card__wp border">
  <img src="/html-retrieve-error.svg" alt="Success Logo" class="card--icon" width="75" height="60" />
  <div>
    <h4 class="card--title cart--title__fail">Bad news...</h4>
    <p> We could not retrieve the HTML from: <strong>wasdwasd.com</strong>.</p>
  </div>
</div>`;

const wpLoadingSkeleton = `
<div class="card card__wp border">
  <div class="loading--icon card--icon loading--skeleton"></div>
  <div class="loading__80">
    <h4 class="card--title loading-title loading--skeleton"></h4>
    <p class="loading-p loading--skeleton loading__80"></p>
  </div>
</div>`;