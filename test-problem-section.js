const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.setViewport({ width: 1440, height: 900 });

  await page.goto('http://localhost:3004', { waitUntil: 'networkidle0' });

  // Wait for animations to complete
  await new Promise(r => setTimeout(r, 2000));

  // Scroll to the Problem section
  await page.evaluate(() => {
    const problemSection = document.querySelector('.section-white');
    if (problemSection) {
      // Scroll to show the warning callout area
      window.scrollTo(0, problemSection.offsetTop + problemSection.offsetHeight - 600);
    }
  });

  await new Promise(r => setTimeout(r, 1000));

  // Take screenshot of the transition area
  await page.screenshot({
    path: 'screenshot-problem-solution-transition.png',
    fullPage: false
  });

  console.log('Screenshot saved: screenshot-problem-solution-transition.png');

  // Also take a full page screenshot
  await page.screenshot({
    path: 'screenshot-full-landing.png',
    fullPage: true
  });

  console.log('Full page screenshot saved: screenshot-full-landing.png');

  // Check for any white gap between sections
  const gap = await page.evaluate(() => {
    const warningCallout = document.querySelector('.bg-navy-950');
    const solutionSection = document.querySelector('#solution');

    if (warningCallout && solutionSection) {
      const calloutRect = warningCallout.getBoundingClientRect();
      const solutionRect = solutionSection.getBoundingClientRect();
      const gap = solutionRect.top - calloutRect.bottom;
      return { gap, calloutBottom: calloutRect.bottom, solutionTop: solutionRect.top };
    }
    return null;
  });

  console.log('Gap analysis:', gap);

  await browser.close();
})();
