'use strict'
/*
// https://en.wikipedia.org/wiki/ANSI_escape_code
colors = ["black", "red", "green", "yellow", "blue", "magenta", "cyan", "white"],

_toHtml = content => {
    // Assuming content is generated properly...
    let htmlContent = content
        .split("&").join("&amp;")
        .split("<").join("&lt;")
        .split(">").join("&gt;")
        .split("█").join("&marker;")
        // Bold or increased intensity
        .split("\x1B[1m").join("<b>").split("\x1B[22m").join("</b>")
        // Faint (decreased intensity)
        .split("\x1B[2m").join("")
        // Underline: Single
        .split("\x1B[4m").join("<u>").split("\x1B[24m").join("</u>")
        // Default text color (foreground)
        .split("\x1B[39m").join("</span>")
        // Reset / Normal
        .split("\x1B[0m").join("</span>");
    colors.forEach((name, index) => {
        htmlContent = htmlContent
            .split(`\x1B[3${index}m`).join(`<span class="${name}">`)
            .split(`\x1B[3${index};1m`).join(`<span class="${name}">`)
            .split(`\x1B[9${index}m`).join(`<span class="${name} bright">`);
    });
    return htmlContent;
};
*/

module.exports = string => {
  const htmlEntities = string
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/█/g, '&marker;')
  if (htmlEntities.includes('\x1B[')) {
    return htmlEntities
        // .replace(/\x1B\[)
        // .        .split("\x1B[1m").join("<b>").split("\x1B[22m").join("</b>")


  }
  return htmlEntities
}
