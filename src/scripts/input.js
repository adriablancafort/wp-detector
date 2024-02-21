document.addEventListener("DOMContentLoaded", (event) => {
  const inputForm = document.getElementById('inputForm');
  const outputContainer = document.getElementById('outputContainer');

  let oldUrl = '';

  inputForm.addEventListener('submit', (event) => {
    event.preventDefault();

    // Get the inputUrl url
    let inputUrl = document.getElementById('inputUrl').value;

    if (oldUrl !== inputUrl) {
      const websiteName = formatWebsiteName(inputUrl);
      outputContainer.innerHTML = analyzingResultsTitle(websiteName);
      outputContainer.innerHTML += detectWpSkeleton;

      if (validateUrl(inputUrl)) {
        oldUrl = inputUrl;
        inputUrl = sanatizeUrl(inputUrl); 

        apiRequest(inputUrl, "wp").then(data => {
          outputContainer.innerHTML = showingResultsTitle(websiteName);      

          if (data.wp === "yes") {
            outputContainer.innerHTML += detectWpSuccess(websiteName);

            const themesContainer = document.createElement('div');
            outputContainer.appendChild(themesContainer);
            themesContainer.innerHTML = analyzingThemesTitle(websiteName);
            themesContainer.innerHTML += detectThemesSkeleton;

            apiRequest(inputUrl, "themes").then(data => {
              themesContainer.innerHTML = detectThemesTitle(websiteName);

              if (data.themes) {
                data.themes.forEach(theme => {
                  themesContainer.innerHTML += detectThemesCard;
                });
              } else {
                themesContainer.innerHTML += `No themes detected in ${websiteName}.`;
              }
            });

            const pluginsContainer = document.createElement('div');
            outputContainer.appendChild(pluginsContainer);
            pluginsContainer.innerHTML = analyzingPluginsTitle(websiteName);
            pluginsContainer.innerHTML += detectPluginsSkeleton; 
            pluginsContainer.innerHTML += detectPluginsSkeleton;
            pluginsContainer.innerHTML += detectPluginsSkeleton; 

            apiRequest(inputUrl, "plugins").then(data => {
              pluginsContainer.innerHTML = detectPluginsTitle(websiteName);

              if (data.plugins) {
                data.plugins.forEach(plugin => {
                  pluginsContainer.innerHTML += detectPluginsCard;
                });
              } else {
                  pluginsContainer.innerHTML += `No themes detected in ${websiteName}.`;
              }
            });

          } else if (data.wp === "no") {
            outputContainer.innerHTML += detectWpFail(websiteName);
          }

        }).catch(() => {
          outputContainer.innerHTML = showingResultsTitle(websiteName);  
          outputContainer.innerHTML += htmlRetrieveError(websiteName);
        });

      } else {
        oldUrl = '';
        outputContainer.innerHTML += invalidUrl;
      }
    }
  });
});

// Functions

const formatWebsiteName = (url) => {
  url = url.replace(/^(https?:\/\/)?/, '');
  url = url.replace(/\/+$/, '');
  url = url.slice(0).toLowerCase();
  return url;
}

const validateUrl = (string) => {
  let pattern = new RegExp('^(https?:\\/\\/)?' + // validate protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // validate domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))' + // validate OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // validate port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?' + // validate query string
    '(\\#[-a-z\\d_]*)?$', 'i'); // validate fragment locator
  return !!pattern.test(string);
}

const sanatizeUrl = (url) => {
  url = url.replace(/\/+$/, ''); // Remove / at the end of the URL if needed
  if (!/^https?:\/\//i.test(url)) { // Add https:// if needed
    url = 'https://' + url;          
  }
  return url;
};

const apiRequest = (inputUrl, type) => {
  return fetch(`https://api.wp-detector.com/index.php?url=${inputUrl}&type=${type}`)
    .then(response => response.json());
};

// Elements

const invalidUrl = `
<p class="input--invalid-message">
  Invalid URL. Please enter a valid URL.
</p>`;

const analyzingResultsTitle = (websiteName) => `
<h3 class="input--section-title input--section-title__analyzing">
  Analyzing <strong>${websiteName}</strong>
</h3>`;

const analyzingThemesTitle = (websiteName) => `
<h3 class="input--section-title input--section-title__analyzing">
  Analyzing themes in <strong>${websiteName}</strong>
</h3>`;

const analyzingPluginsTitle = (websiteName) => `
<h3 class="input--section-title input--section-title__analyzing">
  Analyzing plugins in <strong>${websiteName}</strong>
</h3>`;

const showingResultsTitle = (websiteName) => `
<h3 class="input--section-title">
  Showing results for <strong>${websiteName}</strong>:
</h3>`;

const detectThemesTitle = (websiteName) => `
<h3 class="input--section-title">
  Detected <strong>themes</strong> in ${websiteName}:
</h3>`;

const detectPluginsTitle = (websiteName) => `
<h3 class="input--section-title">
  Detected <strong>plugins</strong> in ${websiteName}:
</h3>`;

const detectWpSuccess = (websiteName) => `
<div class="card card__wp border">
  <img src="/wordpress-detector-success.svg" alt="Success Logo" class="card--icon" width="75" height="60" />
  <div>
    <h4 class="card--title cart--title__success">Hurray!</h4>
    <p><strong>${websiteName}</strong> is using WordPress!</p>
  </div>
</div>`;

const detectWpFail = (websiteName) => `
<div class="card card__wp border">
  <img src="/wordpress-detector-fail.svg" alt="Success Logo" class="card--icon" width="75" height="60" />
  <div>
    <h4 class="card--title cart--title__fail">Bad news...</h4>
    <p><strong>${websiteName}</strong> is not using WordPress.</p>
  </div>
</div>`;

const htmlRetrieveError = (websiteName) => `
<div class="card card__wp border">
  <img src="/html-retrieve-error.svg" alt="Success Logo" class="card--icon" width="75" height="60" />
  <div>
    <h4 class="card--title cart--title__fail">Bad news...</h4>
    <p> We could not retrieve the HTML from: <strong>${websiteName}</strong>.</p>
  </div>
</div>`;

const detectWpSkeleton = `
<div class="card card__wp border">
  <div class="loading--icon card--icon loading--skeleton"></div>
  <div class="loading__80">
    <h4 class="card--title loading-title loading--skeleton"></h4>
    <p class="loading-p loading--skeleton loading__80"></p>
  </div>
</div>`;

const detectThemesCard = `
<div class="card card--hover border">
  <img src="https://generatepress.com/wp-content/themes/generatepress/screenshot.png" alt="Theme Banner" class="card--banner" />
  <div class="card--info-container">
    <h4 class="card--title">GeneratePress</h4>
    <p>Author: <strong>Tom Usborne</strong></p>
    <p>Version: <span class="badge">3.4.0</span></p>
    <p>Website: <a href="https://generatepress.com">generatepress.com</a></p>
    <p>WordPress Version: <strong>5.2 or higher</strong></p>
    <p>Tested up To: <strong>6.3</strong></p>
    <p>PHP Version: <strong>5.6 or higher</strong></p>
    <p class="card--description">
      <strong>Description:</strong> GeneratePress is a lightweight WordPress theme
      built with a focus on speed and usability. Performance is important to us,
      which is why a fresh GeneratePress install adds less than 10kb (gzipped)
      to your page size. We take full advantage of the block editor (Gutenberg),
      which gives you more control over creating your content. If you use page
      builders, GeneratePress is the right theme for you. It is completely compatible
      with all major page builders, including Beaver Builder and Elementor. Thanks
      to our emphasis on WordPress coding standards, we can boast full compatibility
      with all well-coded plugins, including WooCommerce. GeneratePress is fully
      responsive, uses valid HTML/CSS, and is translated into over 25 languages
      by our amazing community of users. A few of our many features include 60+
      color controls, powerful dynamic typography, 5 navigation locations, 5 sidebar
      layouts, dropdown menus (click or hover), and 9 widget areas.
    </p>
  </div>
  <div class="cart--read-more--container">
    <span class="cart--read-more">
      <svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" height="25px" width="25px" >
        <path fill="currentColor" d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" ></path>
      </svg>
      Read more
    </span>
  </div>
</div>`;

const detectThemesSkeleton = `
<div class="card border">
  <div class="loading--image loading--skeleton"></div>
  <div class="card--info-container">
    <h4 class="card--title loading-title loading--skeleton"></h4>
    <p class="loading-p loading--skeleton loading__30"></p>
    <p class="loading-p loading--skeleton loading__30"></p>
    <p class="loading-p loading--skeleton loading__30"></p>
    <p class="loading-p loading--skeleton loading__30"></p>
    <p class="loading-p loading--skeleton loading__30"></p>
    <p class="loading-p loading--skeleton loading__30"></p>
    <p class="loading-p loading--skeleton"></p>
    <p class="loading-p loading--skeleton"></p>
    <p class="loading-p loading--skeleton"></p>
    <p class="loading-p loading--skeleton"></p>
    <p class="loading-p loading--skeleton"></p>
    <p class="loading-p loading--skeleton"></p>
    <p class="loading-p loading--skeleton"></p>
    <p class="loading-p loading--skeleton loading__80"></p>
  </div>
</div>`;

const detectPluginsCard = `
<div class="card card--hover border">
  <img src="https://ps.w.org/wordpress-seo/assets/banner-772x250.png?rev=2643727" alt="Plugin Banner" class="card--banner" />
  <div class="card--info-container">
    <div class="card--title-container__plugin">
      <img src="https://ps.w.org/wordpress-seo/assets/icon.svg?rev=2363699" alt="Plugin Icon" class="card--icon" width="60px" height="60px" />
      <h4 class="card--title">Yoast SEO</h4>
    </div>
    <p>Author: <strong>Team Yoast</strong></p>
    <p>Version: <span class="badge">22.0</span></p>
    <p>Website: <a href="https://yoast.com">yoast.com</a></p>
    <p>WordPress Version: <strong>6.3 or higher</strong></p>
    <p>Tested up To: <strong>6.4.3</strong></p>
    <p>PHP Version: <strong>7.2.5 or higher</strong></p>
    <p class="card--description">
      <strong>Description:</strong>
      Supercharge your website’s visibility and attract organic traffic with Yoast
      SEO, the WordPress SEO plugin trusted by millions worldwide. With those millions
      of users, we’ve definitely helped someone like you! Users of our plugin range
      from owners of small-town bakeries and local physical stores to some of the
      world’s largest and most influential organizations. And we’ve done this since
      2008! Yoast SEO Free provides the essentials to kickstart your SEO, and the
      Yoast SEO Premium plugin and its extensions unlock extra tools and functionality
      to take your SEO to the next level.
    </p>
  </div>
  <div class="cart--read-more--container">
    <span class="cart--read-more">
      <svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" height="25px" width="25px" >
        <path fill="currentColor" d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" ></path>
      </svg>
      Read more
    </span>
  </div>
</div>`;

const detectPluginsSkeleton = `
<div class="card border">
  <div class="loading--image loading--skeleton"></div>
  <div class="card--info-container">
    <div class="card--title-container__plugin">
      <div class="loading--icon card--icon loading--skeleton"></div>
      <h4 class="card--title loading-title loading--skeleton"></h4>
    </div>
    <p class="loading-p loading--skeleton loading__30"></p>
    <p class="loading-p loading--skeleton loading__30"></p>
    <p class="loading-p loading--skeleton loading__30"></p>
    <p class="loading-p loading--skeleton loading__30"></p>
    <p class="loading-p loading--skeleton loading__30"></p>
    <p class="loading-p loading--skeleton loading__30"></p>
    <p class="loading-p loading--skeleton loading__30"></p>
    <p class="loading-p loading--skeleton"></p>
    <p class="loading-p loading--skeleton"></p>
    <p class="loading-p loading--skeleton"></p>
    <p class="loading-p loading--skeleton"></p>
    <p class="loading-p loading--skeleton"></p>
    <p class="loading-p loading--skeleton"></p>
    <p class="loading-p loading--skeleton"></p>
    <p class="loading-p loading--skeleton loading__80"></p>
  </div>
</div>`;
